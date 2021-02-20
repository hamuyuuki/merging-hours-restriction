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
    sha: context.sha,
    state: 'success',
    description: 'You can merge now!',
    context: 'Merging Hours Restriction'
  })
}

run()
