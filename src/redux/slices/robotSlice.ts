import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { QaStatus, Robot, RobotsState } from "../../models/Robots"
import { qaProcessAsyncAction, sendShipmentAsyncAction } from "../asyncActions.ts/robotsAsyncActions"

// Set Initial State
const initialState: RobotsState = {
  robots: [],
  factorySeconds: [],
  passedQa: [],
  readyToShipRobots: [],
  activeTab: QaStatus.PASSED_QA
}

const addRobotToReadyToShip = (state: RobotsState, action: PayloadAction<{ robotData: Robot }>) => {
  const { robotData } = action.payload
  const targetArray = robotData.qaStatus === QaStatus.PASSED_QA ? state.passedQa : state.factorySeconds

  // Filter the targetArray to remove any robots with the same ID as robotData
  const filteredArray = targetArray.filter(robot => robot.id !== robotData.id)

  // Assign the filteredArray back to targetArray
  if (robotData.qaStatus === QaStatus.PASSED_QA) {
    state.passedQa = filteredArray
  } else {
    state.factorySeconds = filteredArray
  }

  state.readyToShipRobots = [...state.readyToShipRobots, robotData]
}



const removeRobotFromReadyToShip = (state: RobotsState, action: PayloadAction<{ robotData: Robot }>) => {
  const { robotData } = action.payload

  // Determine which array to insert the robot back into based on its QA status
  const targetArray = robotData.qaStatus === QaStatus.PASSED_QA ? state.passedQa : state.factorySeconds

  // Insert the robot back into the array at its original index
  targetArray.splice(robotData.originalIndex ?? 0, 0, robotData)

  // Remove the robot from the readyToShipRobots array
  state.readyToShipRobots = state.readyToShipRobots.filter((robot) => robot.id !== robotData.id)
}


const updateRobots = (state: RobotsState, action: PayloadAction<{ factorySeconds: Robot[], passedQa: Robot[] }>) => {
  const { factorySeconds, passedQa } = action.payload
  // Update the state's factorySeconds property to the new array of robots with factory seconds.
  state.factorySeconds = factorySeconds
  // Update the state's passedQa property to the new array of robots that passed QA.
  state.passedQa = passedQa
}

const updateReadyToShip = (state: RobotsState, action: PayloadAction<{ readyToShipRobots: Robot[] }>) => {
  const { readyToShipRobots } = action.payload
  // Update the state's readyToShipRobots property to the new array of robots that are ready to ship.
  state.readyToShipRobots = readyToShipRobots
}

const robotSlice = createSlice({
  name: "robots",
  initialState,
  reducers: {
    addRobotToReadyToShipAction: addRobotToReadyToShip,
    removeRobotFromReadyToShipAction: removeRobotFromReadyToShip
  },
  extraReducers: builder => {
    builder.addCase(qaProcessAsyncAction.fulfilled, updateRobots)
    builder.addCase(sendShipmentAsyncAction.fulfilled, updateReadyToShip)
  }
})

export const {
  addRobotToReadyToShipAction,
  removeRobotFromReadyToShipAction
} = robotSlice.actions

export default robotSlice.reducer