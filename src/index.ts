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
    sha: 'eef6b04cfd73df8a36d65d75a23221f70c7fe29b',
    state: 'success',
    description: 'You can merge now!',
    context: `${context.workflow_name} / ${context.job_name} (push)`
  })

  core.info('You can merge now!')
  core.setFailed("You can't merge now!")
  core.info('You can merge now!')
}

run()
