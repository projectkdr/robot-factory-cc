import React from 'react'
import { QaStatus } from '../../../models/Robots'
import styles from './FilterTab.module.scss'

type FilterTabProps = {
  activeTab: QaStatus
  handleFilterOptionOnClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const FilterTab = ({ activeTab, handleFilterOptionOnClick }: FilterTabProps) => {
  return (
    <div className={styles.background} data-testid='filter-tab-container'>
      <div className="container">
        <div className={styles.filter}>
          <div className={styles.filter__list}>
            <div
              className={`${styles.filter__option} ${activeTab === QaStatus.PASSED_QA ? styles.isActive : ''}`}
              data-testid={QaStatus.PASSED_QA}
              data-quality={QaStatus.PASSED_QA}
              onClick={handleFilterOptionOnClick}
            >
              {QaStatus.PASSED_QA}
            </div>
            <div
              className={`${styles.filter__option} ${
                activeTab === QaStatus.FACTORY_SECONDS ? styles.isActive : ''
              }`}
              data-testid={QaStatus.FACTORY_SECONDS}
              data-quality={QaStatus.FACTORY_SECONDS}
              onClick={handleFilterOptionOnClick}
            >
              {QaStatus.FACTORY_SECONDS}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterTab
