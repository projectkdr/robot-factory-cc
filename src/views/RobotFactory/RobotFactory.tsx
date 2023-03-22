import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FilterTab from '../../components/Header/FilterTab/FilterTab'
import Header from '../../components/Header/Header'
import { QaStatus } from '../../models/Robots'
import { qaProcessAsyncAction } from '../../redux/asyncActions.ts/robotsAsyncActions'
import { AppDispatch, RootState } from '../../redux/store'
import RobotItem from './../../components/RobotItem/RobotItem'
import styles from './RobotFactory.module.scss'

const RobotFactory = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { factorySeconds, passedQa } = useSelector((state: RootState) => state.robots)
  const [activeTab, setActiveTab] = useState(QaStatus.PASSED_QA)
  useEffect(() => {
    console.log('useEffect')
    dispatch(qaProcessAsyncAction())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterOptionOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = event.currentTarget
    const dataQuality = targetElement.getAttribute('data-quality') as QaStatus
    setActiveTab(dataQuality)
  }

  return (
    <>
      <Header />
      <FilterTab activeTab={activeTab} handleFilterOptionOnClick={handleFilterOptionOnClick} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Passed QA Robots */}
          {activeTab === QaStatus.PASSED_QA && (
            <div className="row">
              {passedQa.map(robotData => (
                <RobotItem key={robotData.id} robotData={robotData} />
              ))}
            </div>
          )}

          {/* Factory Seconds Robots */}
          {activeTab === QaStatus.FACTORY_SECONDS && (
            <div className="row">
              {factorySeconds.map(robotData => (
                <RobotItem key={robotData.id} robotData={robotData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default RobotFactory
