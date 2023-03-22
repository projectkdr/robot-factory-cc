import React from 'react'
import { Robot } from '../../models/Robots'
import styles from './RobotItem.module.scss'
import { ReactComponent as SentienceIcon } from '../../assets/img/sentience_icon.svg'
import { ReactComponent as TrackIcon } from '../../assets/img/track_icon.svg'
import { ReactComponent as WheelIcon } from '../../assets/img/wheel_icon.svg'
import { ReactComponent as RotorIcon } from '../../assets/img/rotor_icon.svg'
import { useDispatch } from 'react-redux'
import { addRobotToReadyToShipAction } from '../../redux/slices/robotSlice'

type RobotItemProps = {
  robotData: Robot
}

const RobotItem = ({ robotData }: RobotItemProps) => {
  const dispatch = useDispatch()
  const { id, name, configuration } = robotData
  const { hasSentience, hasTracks, hasWheels, numberOfRotors, colour } = configuration

  const handleOnClickItem = () => {
    dispatch(addRobotToReadyToShipAction({ robotData }))
  }

  return (
    <div className="col-width">
      <div className={styles.container}>
        <div className={styles.image_wrapper}>
          <img
            className={styles.image}
            src={`https://robohash.org/${name}?set=set1`}
            alt={name}
            style={{ backgroundColor: colour }}
          />
          <div className={styles.id}>{id}</div>
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{name}</div>
          <div className={styles.colour}>Colour: {colour}</div>
          <div className={styles.rotor}>
            <RotorIcon />
            <span>{numberOfRotors}</span>
          </div>
          <div className={styles.configurations}>
            {hasSentience && <SentienceIcon data-testid="sentience-icon" />}
            {hasTracks && <TrackIcon data-testid="track-icon" />}
            {hasWheels && <WheelIcon data-testid="wheel-icon" />}
          </div>
        </div>
        <div className={styles.addToShipment} onClick={handleOnClickItem}>
          <button className={styles.addToShipment__button} data-testid="add-to-shipment">Add to shipment</button>
        </div>
      </div>
    </div>
  )
}

export default RobotItem
