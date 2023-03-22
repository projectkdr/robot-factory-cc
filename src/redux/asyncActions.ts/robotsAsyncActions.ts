import { createAsyncThunk } from "@reduxjs/toolkit"
import { QaStatus, Robot, RobotStatuses } from "../../models/Robots"
import { apiHandlerWrapper } from "../../utils/helperUtils"
import { RootState } from "../store"

const API_URL = 'http://localhost:8000'

const shouldRecycleRobot = (robot: Robot): boolean => {
  const { configuration, statuses } = robot

  // Check if the robot meets any of the following conditions for recycling
  return (
    configuration.numberOfRotors < 3 || // fewer than 3 rotors
    configuration.numberOfRotors > 8 || // greater than 8 rotors
    (configuration.numberOfRotors && configuration.colour === 'blue') || // Any number of rotors and blue in colour
    (configuration.hasWheels && configuration.hasTracks) || // Has both wheels and tracks
    (configuration.hasWheels && statuses.includes(RobotStatuses.RUSTY)) || // Has wheels and is rusty
    (configuration.hasSentience && statuses.includes(RobotStatuses.LOOSE_SCREWS)) || // Is sentient and has loose screws
    statuses.includes(RobotStatuses.ON_FIRE) // Is on fire
  )
}

const extinguishOnFireRobots = async () => {
  // Call an API handler wrapper function, passing in an asynchronous function as an argument
  await apiHandlerWrapper(async () => {
    // Make a GET request to the API to retrieve a list of robots
    // json-server pass 10 response per page
    const response = await fetch(`${API_URL}/robots?_page=1`)
    // Parse the response as JSON and assign the resulting array of robot data to a variable
    const robotDatas = await response.json() as Robot[]

    // Filter the robot data to only include robots that have sentience and are on fire
    const extinguishRobotDataPromises = robotDatas
      .filter(robotData => robotData.configuration.hasSentience && robotData.statuses.includes(RobotStatuses.ON_FIRE))
      // Map over the filtered robot data and create an array of promises to send PATCH requests to the API to update the robot status
      .map(async robotData => {
        // Filter out the "on fire" status from the robot's statuses
        const filterStatuses = robotData.statuses.filter(status => status !== RobotStatuses.ON_FIRE)
        // Send a PATCH request to the API to update the robot's status
        await fetch(`${API_URL}/robots/${robotData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          // Include the updated statuses in the request body as JSON
          body: JSON.stringify({
            statuses: filterStatuses
          })
        })
      })

    // Wait for all of the PATCH requests to complete before continuing
    await Promise.all(extinguishRobotDataPromises)
  })
}

const deleteRobot = async (robotId: number) => {
  const deleteResponse = await fetch(`${API_URL}/robots/${robotId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!deleteResponse.ok) {
    if (deleteResponse.status === 404) {
      console.log('Robot not found. Skipping deletion...')
    } else {
      console.log(`Error deleting robot. Server responded with status ${deleteResponse.status}`)
    }
  } else {
    // If the response indicates success, print a message to the console indicating that the robot was deleted
    console.log('Robot deleted successfully')
  }
}

const recycleRobots = async () => {
  // Call an API handler wrapper function, passing in an asynchronous function as an argument
  return await apiHandlerWrapper(async () => {
    // Make a GET request to the API to retrieve a list of robots
    // json-server pass 10 response per page
    const response = await fetch(`${API_URL}/robots?_page=1`)
    // Parse the response as JSON and assign the resulting array of robot data to a variable
    const robotDatas = await response.json() as Robot[]

    // Create an empty array to hold the robots that will not be recycled
    const unRecycledRobots: Robot[] = []

    // Iterate over the robot data and determine whether each robot should be recycled
    for (const robotData of robotDatas) {
      if (shouldRecycleRobot(robotData)) {
        await deleteRobot(robotData.id)
        // Continue to the next robot in the loop
        continue
      }
      // If the robot should not be recycled, add it to the array of unrecycled robots
      unRecycledRobots.push(robotData)
    }

    // Return the array of unrecycled robots
    return unRecycledRobots
  })
}


export const qaProcessAsyncAction = createAsyncThunk(
  'robots/qaProcessAsyncAction',
  async (_, thunkAPI) => {
    try {
      // Call the `extinguishOnFireRobots` function to extinguish any robots on fire
      await extinguishOnFireRobots()
      // Call the `recycleRobots` function to recycle any robots that are not ready for shipment
      const unRecycledRobots = await recycleRobots()

      // Create arrays to hold the factory seconds and passed QA robots
      const factorySeconds: Robot[] = []
      const passedQa: Robot[] = []

      // Iterate over the unrecycled robots and determine whether they passed QA or are factory seconds
      for (const robot of unRecycledRobots) {
        if (robot.statuses.length === 0) {
          // If the robot has no statuses, it has passed QA
          passedQa.push(robot)
          continue
        }
        // If the robot has one or more statuses, it is a factory second
        factorySeconds.push(robot)
      }

      // Add original index and QA status properties to the factory seconds and passed QA robots
      for (let i = 0; i < factorySeconds.length; i++) {
        const robot = factorySeconds[i]
        robot.originalIndex = i
        robot.qaStatus = QaStatus.FACTORY_SECONDS
      }

      for (let i = 0; i < passedQa.length; i++) {
        const robot = passedQa[i]
        robot.originalIndex = i
        robot.qaStatus = QaStatus.PASSED_QA
      }

      return {
        factorySeconds,
        passedQa
      }
    } catch (error: any) {
      const { response } = error
      const errorMessage = response?.data?.message || 'Something went wrong'
      return thunkAPI.rejectWithValue({ errorMessage })
    }
  }
)

export const sendShipmentAsyncAction = createAsyncThunk(
  'robots/sendShipmentAsyncAction',
  async (_, thunkAPI) => {
    try {

      // Get the readyToShipRobots from the robots state
      const readyToShipRobots = (thunkAPI.getState() as RootState).robots.readyToShipRobots

      for (const robotData of readyToShipRobots) {
        // Delete the robot data from the robot database
        await deleteRobot(robotData.id)

        // Add the data from the shipment database
        await fetch(`${API_URL}/shipments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: robotData.id
          })
        })

      }

      return {
        readyToShipRobots: [] as Robot[]
      }
    } catch (error: any) {
      const { response } = error
      const errorMessage = response?.data?.message || 'Something went wrong'
      return thunkAPI.rejectWithValue({ errorMessage })
    }
  }
)