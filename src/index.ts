import * as core from '@actions/core'
import {getInputs, getContext} from './actions-toolkit'
import {currentPushableHours} from './merging-hours-restriction'

async function run(): Promise<void> {
  const inputs = getInputs()
  const context = getContext()

  currentPushableHours(inputs.startHour, inputs.endHour)

  core.info(new Date().toString())
  core.info('You can merge now!')
}

run()
