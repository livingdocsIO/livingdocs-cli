const chalk = require('chalk')
const {Command} = require('@oclif/command')
const inquirer = require('inquirer')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/project_config_result_reporter')
const readProjectConfig = require('../../lib/read_project_config')
const updateRevisionNumber = require('../../lib/update_revision_number')

class PublishCommand extends Command {
  static description = `Publish a project configuration to your project`
  static flags = {
    project: sharedFlags.project,
    env: sharedFlags.env,
    yes: sharedFlags.yes,
    token: {...sharedFlags.configWriteToken, required: true},
    host: {...sharedFlags.host, required: true},
    source: {...sharedFlags.source},
    dist: {...sharedFlags.dist}
  }

  async run () {
    const {token, host, source, dist, env, yes} = this.parse(PublishCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    if (!source && !dist) throw new Error('Missing a source param')

    const config = await readProjectConfig({source: source || dist})
      .catch((err) => {
        this.log(chalk.red('✕ Parsing Failed'))
        throw err
      })

    let ok = false
    await liApi.plan({host, token, projectConfig: config})
      .then((result) => {
        ok = result.ok

        // early return if there are no chagnes
        if (!result.patches?.length) ok = false

        resultReporter({result, log: this.log})
      })
      .catch(reportError)

    if (!ok) return

    if (!yes) {
      const answers = await inquirer.prompt([{
        name: 'continue',
        type: 'confirm',
        default: false,
        message: `Are you sure to publish${env ? ` to ${env}` : ''}?`
      }])

      if (!answers.continue) return
    }

    await liApi.publish({host, token, projectConfig: config})
      .then((result) => {
        resultReporter({result, log: this.log})
        updateRevisionNumber({
          source: source || dist,
          revisionNumberBefore: config.$baseRevision,
          revisionNumber: result.revisionNumber
        })
      })
      .catch(reportError)
  }
}

module.exports = PublishCommand
