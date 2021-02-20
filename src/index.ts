import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {getInputs, getContext} from './actions-toolkit'
import {
  currentPushableHours,
  updateBranchRestrictionRule
} from './merging-hours-restriction'

async function run(): Promise<void> {
  const inputs = getInputs()
  const context = getContext()

  currentPushableHours(inputs.startHour, inputs.endHour)

  const octokit = new Octokit({
    auth: inputs.privateKey
  })

  octokit.repos.createCommitStatus({
    owner: context.repository_owner,
    repo: context.repository_name,
    sha: '56b418eacc7329ca8b8f45e8583be5fa58a54cdd',
    state: 'failure',
    description: 'You can merge now!',
    context: 'Merging Hours Restriction'
  })
}

run()
