import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import Header from '../components/Header/Header'
import { sendShipmentAsyncAction } from '../redux/asyncActions.ts/robotsAsyncActions'

const mockStore = configureStore([thunk])

describe('Header component', () => {
  let store: MockStore
  let headerContainer: HTMLElement;
  beforeEach(() => {
    store = mockStore({
      robots: {
        readyToShipRobots: [
          { id: 1, name: 'Robot 1' },
          { id: 2, name: 'Robot 2' },
          { id: 3, name: 'Robot 3' }
        ]
      }
    })

    const { container } = render(
      <Provider store={store}>
        <Header />
      </Provider>
    )

    headerContainer = container
  })

  it('should render shipment icon', () => {
    const shipmentIcon = headerContainer.querySelector('#header-shipment-icon')
    expect(shipmentIcon).toBeInTheDocument()
  })

  it('should display number of ready-to-ship robots', () => {
    const badge = headerContainer.querySelector('#header-shipment-badge')
    expect(badge).toHaveTextContent('3')
  })

  it('should remove robot from ready-to-ship list', () => {
    const removeButtons = headerContainer.querySelectorAll('[data-index]')
    fireEvent.click(removeButtons[1])

    expect(store.getActions()).toEqual([
      {
        payload: { robotData: { id: 2, name: 'Robot 2' } },
        type: 'robots/removeRobotFromReadyToShipAction'
      }
    ])
  })
})
