const chalk = require('chalk')
const {Command} = require('@oclif/command')
const inquirer = require('inquirer')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/channel_config_result_reporter')
const readChannelConfig = require('../../lib/read_channel_config')
const updateRevisionNumber = require('../../lib/update_revision_number')

const description = `Publish a ChannelConfig to your project`
const commandFlags = {
  project: sharedFlags.project,
  env: sharedFlags.env,
  token: {...sharedFlags.configWriteToken, required: true},
  host: {...sharedFlags.host, required: true},
  dist: {
    ...sharedFlags.dist,
    required: true,
    description: 'The folder or filename to the channelConfig.'
  }
}

class PublishCommand extends Command {

  async run () {
    const {token, host, dist, env} = this.parse(PublishCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    const config = await readChannelConfig({source: dist})
      .catch((err) => {
        this.log(chalk.red('✕ Parsing Failed'))
        throw err
      })

    // safety check for production environment
    if (env === 'production') {
      const answers = await inquirer.prompt([{
        name: 'continue',
        type: 'confirm',
        default: false,
        message: `Are you sure to publish to production?`
      }])

      if (!answers.continue) return
    }

    await liApi.publish({host, token, channelConfig: config})
      .then((result) => {
        resultReporter(result, this.log)
        updateRevisionNumber({
          source: dist,
          revisionNumberBefore: config.$baseRevision,
          revisionNumber: result.revisionNumber
        })
      })
      .catch(reportError)
  }
}

PublishCommand.description = description
PublishCommand.flags = commandFlags
module.exports = PublishCommand
