
export type RobotsState = {
  robots: Robot[],
  factorySeconds: Robot[],
  passedQa: Robot[],
  readyToShipRobots: Robot[],
  activeTab: QaStatus.FACTORY_SECONDS | QaStatus.PASSED_QA
}

export type Robot = {
  id: number,
  name: string,
  configuration: RobotConfiguration,
  statuses: string[]
  originalIndex?: number,
  qaStatus?: QaStatus.FACTORY_SECONDS | QaStatus.PASSED_QA
}

export type RobotConfiguration = {
  hasSentience: boolean,
  hasWheels: boolean,
  hasTracks: boolean,
  numberOfRotors: number,
  colour: string,
}

export enum RobotStatuses {
  ON_FIRE = 'on fire',
  RUSTY = 'rusty',
  LOOSE_SCREWS = 'loose screws',
  PAINT_SCRATCHED = 'paint scratched'
}

export enum QaStatus {
  FACTORY_SECONDS = 'Factory seconds',
  PASSED_QA = 'Passed QA'
}
