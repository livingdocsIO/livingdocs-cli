const chalk = require('chalk')
const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/channel_config_result_reporter')
const readChannelConfig = require('../../lib/read_channel_config')

class UploadCommand extends Command {
  static description = `Upload a ChannelConfig into a draft for your project`
  static flags = {
    project: sharedFlags.project,
    env: sharedFlags.env,
    token: {...sharedFlags.configWriteToken, required: true},
    host: {...sharedFlags.host, required: true},
    dist: flags.string({
      char: 'd',
      required: true,
      description: 'The folder or filename to the channelConfig.'
    }),
    draftName: flags.string({
      description: 'The name of the draft the config will be saved under.',
      required: true
    })
  }

  async run () {
    const {token, host, dist} = this.parse(UploadCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    const config = await readChannelConfig({source: dist})
      .catch((err) => {
        this.log(chalk.red('✕ Parsing Failed'))
        throw err
      })


    await liApi.uploadDraft({host, token, channelConfig: config})
      .then((result) => {
        resultReporter(result, this.log)
      })
      .catch(reportError)
  }
}

module.exports = UploadCommand
