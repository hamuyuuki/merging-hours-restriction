import {getInputs, getContext} from './actions-toolkit'
import {
  currentPushableHours,
  updateBranchRestrictionRule
} from './merging-hours-restriction'

async function run(): Promise<void> {
  const inputs = getInputs()
  const context = getContext()

  currentPushableHours(inputs.startHour, inputs.endHour)
}

run()
