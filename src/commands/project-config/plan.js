const {Command} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/project_config_result_reporter')
const readProjectConfig = require('../../lib/read_project_config')

class PlanCommand extends Command {
  static description = `See what would be updated in a publish command`
  static flags = {
    project: sharedFlags.project,
    env: sharedFlags.env,
    token: {...sharedFlags.configWriteToken, required: true},
    host: {...sharedFlags.host, required: true},
    source: {...sharedFlags.source},
    dist: {...sharedFlags.dist}
  }

  async run () {
    const {token, host, source, dist} = this.parse(PlanCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    if (!source && !dist) throw new Error('Missing a source param')

    const config = await readProjectConfig({source: source || dist})

    await liApi.plan({host, token, projectConfig: config})
      .then((result) => {
        resultReporter({result, log: this.log})
      })
      .catch(reportError)
  }
}

module.exports = PlanCommand
