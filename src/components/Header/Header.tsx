import React from 'react'
import { ReactComponent as ShipmentIcon } from '../../assets/img/shipment_icon.svg'
import { ReactComponent as RemoveShipmentIcon } from '../../assets/img/remove_shipment_icon.svg'
import styles from './Header.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { Robot } from '../../models/Robots'
import { removeRobotFromReadyToShipAction } from '../../redux/slices/robotSlice'
import { sendShipmentAsyncAction } from '../../redux/asyncActions.ts/robotsAsyncActions'

const Header = () => {
  const dispatch = useDispatch<AppDispatch>()
  const readyToShipRobots = useSelector((state: RootState) => state.robots.readyToShipRobots)

  const handleOnClickRemoveShipment = (event: React.MouseEvent<SVGSVGElement>) => {
    const targetElement = event.currentTarget
    const dataIndex = parseInt(targetElement.getAttribute('data-index') || '0')

    const robotData: Robot = readyToShipRobots[dataIndex]

    dispatch(removeRobotFromReadyToShipAction({ robotData }))
  }

  const handleOnClickSendShipment = () => {
    dispatch(sendShipmentAsyncAction())
  }

  return (
    <div className={styles.header} data-testid='header-container'>
      <div className="container">
        <div className={`${styles.shipment} ${readyToShipRobots.length > 0 ? styles.has_shipment : ''}`}>
          <ShipmentIcon id='header-shipment-icon' className={styles.shipment__icon} />
          {readyToShipRobots.length > 0 && <div id='header-shipment-badge' className={styles.shipment__badge}>{readyToShipRobots.length}</div>}
        </div>
        <div className={styles.list}>
          <button id='header-send-shipment-btn' className={styles.send_shipment} onClick={handleOnClickSendShipment}>
            {'Send shipment'}
          </button>
          {readyToShipRobots.map((robot, index) => (
            <div key={robot.id} className={styles.item}>
              <img
                className={styles.item__image}
                src={`https://robohash.org/${robot.name}?set=set1`}
                alt={robot.name}
              />
              <span className={styles.item__name}>{robot.name}</span>
              <RemoveShipmentIcon
                className={styles.item__removebtn}
                data-index={index}
                onClick={handleOnClickRemoveShipment}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header
