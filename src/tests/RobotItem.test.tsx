import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import RobotItem from '../components/RobotItem/RobotItem'
import { Robot } from '../models/Robots'
import { addRobotToReadyToShipAction } from '../redux/slices/robotSlice'

const mockStore = configureStore([])

describe('RobotItem component', () => {
  let robotData: Robot
  let store: ReturnType<typeof mockStore>

  beforeEach(() => {
    robotData = {
      id: 8,
      name: 'Test Robot',
      configuration: {
        hasSentience: true,
        hasTracks: false,
        hasWheels: true,
        numberOfRotors: 2,
        colour: 'red'
      },
      statuses: []
    }

    store = mockStore({
      robots: {
        readyToShip: []
      }
    })

    render(
      <Provider store={store}>
        <RobotItem robotData={robotData} />
      </Provider>
    )
  })

  it('should render robot data', () => {
    expect(screen.getByText(robotData.id)).toBeInTheDocument()
    expect(screen.getByText(robotData.name)).toBeInTheDocument()
    expect(screen.getByText(`Colour: ${robotData.configuration.colour}`)).toBeInTheDocument()
    expect(screen.getByTestId('sentience-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('track-icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('wheel-icon')).toBeInTheDocument()
    expect(screen.getByText(robotData.configuration.numberOfRotors)).toBeInTheDocument()
  })

  it('should dispatch addRobotToReadyToShipAction when add to shipment button is clicked', () => {
    const addToShipmentButton = screen.getByTestId('add-to-shipment')
    addToShipmentButton.click()

    expect(store.getActions()).toEqual([addRobotToReadyToShipAction({ robotData })])
  })
})
