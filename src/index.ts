import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'
import {getInputs, getContext} from './actions-toolkit'
import {
  currentPushableHours,
  updateBranchRestrictionRule
} from './merging-hours-restriction'

async function run(): Promise<void> {
  const inputs = getInputs()
  const context = getContext()

  if (context.branch_name !== 'refs/heads/main') {
    if (currentPushableHours(inputs.startHour, inputs.endHour)) {
      return core.info('You can merge now!')
    } else {
      return core.setFailed('You can not merge now!')
    }
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${inputs.privateKey}`
    }
  })

  const searchQuery = `
    {
      search(query: "is:pr is:open repo:hamuyuuki/merging-hours-restriction updated:>=2021-02-22 draft:false", type: ISSUE, first: 100) {
        nodes {
          ... on PullRequest {
            commits(last: 1) {
              nodes {
                commit {
                  checkSuites(first: 10) {
                    nodes {
                      id
                      checkRuns(filterBy: {checkName: "build"}, first: 1) {
                        nodes {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  const repositoryQuery = `
    {
      repository(owner: "hamuyuuki", name: "merging-hours-restriction") {
        id
      }
    }
  `

  const {search} = await graphqlWithAuth(searchQuery)
  const {repository} = await graphqlWithAuth(repositoryQuery)

  await graphqlWithAuth(
    `
      mutation MyMutation {
        __typename
        rerequestCheckSuite(input: {repositoryId: "${repository.id}", checkSuiteId: "${search.nodes[0].commits.nodes[0].commit.checkSuites.nodes[1].id}"}) {
          clientMutationId
        }
      }
    `
  )
}

run()
