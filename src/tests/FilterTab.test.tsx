import { render, screen } from '@testing-library/react'
import React from 'react'
import FilterTab from '../components/Header/FilterTab/FilterTab'
import { QaStatus } from '../models/Robots'

describe('FilterTab', () => {
  const handleFilterOptionOnClick = jest.fn()

  beforeEach(() => {
    render(<FilterTab activeTab={QaStatus.PASSED_QA} handleFilterOptionOnClick={handleFilterOptionOnClick} />)
  })

  it('should render filter options', () => {
    const passedQaFilterOption = screen.getByTestId(QaStatus.PASSED_QA)
    const factorySecondsFilterOption = screen.getByTestId(QaStatus.FACTORY_SECONDS)

    expect(passedQaFilterOption).toBeInTheDocument()
    expect(factorySecondsFilterOption).toBeInTheDocument()
  })

  it('should highlight the active filter option', () => {
    const passedQaFilterOption = screen.getByTestId(QaStatus.PASSED_QA)
    const factorySecondsFilterOption = screen.getByTestId(QaStatus.FACTORY_SECONDS)

    expect(passedQaFilterOption).toHaveClass('isActive')
    expect(factorySecondsFilterOption).not.toHaveClass('isActive')
  })
})
