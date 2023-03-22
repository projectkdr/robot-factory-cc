import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore, { MockStore } from 'redux-mock-store'
import { QaStatus } from '../models/Robots'
import RobotFactory from '../views/RobotFactory/RobotFactory'
import thunk from 'redux-thunk'
import filterTabStyles from '../components/Header/FilterTab/FilterTab.module.scss'

const mockStore = configureStore([thunk])

describe('RobotFactory', () => {
  let store: MockStore

  beforeEach(() => {
    store = mockStore({
      robots: {
        robots: [],
        factorySeconds: [
          {
            id: '7',
            name: 'Robot 2',
            configuration: {
              hasSentience: false,
              hasWheels: false,
              hasTracks: true,
              numberOfRotors: 1,
              colour: 'pink'
            },
            statuses: ['rusty', 'loose screws', 'paint scratched'],
            originalIndex: 0,
            qaStatus: QaStatus.FACTORY_SECONDS
          }
        ],
        passedQa: [
          {
            id: '8',
            name: 'Robot 1',
            configuration: {
              hasSentience: true,
              hasWheels: false,
              hasTracks: true,
              numberOfRotors: 4,
              colour: 'red'
            },
            statuses: [],
            originalIndex: 0,
            qaStatus: QaStatus.PASSED_QA
          }
        ],
        readyToShipRobots: [],
        activeTab: QaStatus.PASSED_QA
      }
    })

    render(
      <Provider store={store}>
        <RobotFactory />
      </Provider>
    )
  })

  it('renders the header and filter tab', () => {
    expect(screen.getByTestId('header-container')).toBeInTheDocument()
    expect(screen.getByTestId('filter-tab-container')).toBeInTheDocument()
  })

  it('renders passed QA robots when the Passed QA tab is active', () => {
    const passedQaFilterOption = screen.getByTestId(QaStatus.PASSED_QA)
    expect(passedQaFilterOption).toHaveClass(filterTabStyles.isActive)
    expect(screen.getByText('Robot 1')).toBeInTheDocument()
  })

  it('renders factory seconds robots when the Factory Seconds tab is active', () => {
    const factorySecondsFilterOption = screen.getByTestId(QaStatus.FACTORY_SECONDS)
    act(() => {
      factorySecondsFilterOption.click()
    })
    expect(factorySecondsFilterOption).toHaveClass(filterTabStyles.isActive)
    expect(screen.getByText('Robot 2')).toBeInTheDocument()
  })
})
