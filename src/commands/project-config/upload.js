const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/channel_config_result_reporter')
const readChannelConfig = require('../../lib/read_channel_config')

const description = `Upload a ChannelConfig into a draft for your project`
const commandFlags = {
  token: {...sharedFlags.token, required: true},
  host: sharedFlags.host,
  dist: flags.string({
    char: 'd',
    description: 'The folder or filename where to download to.'
  }),
  draftName: flags.string({
    description: 'The name of the draft the config will be saved under.',
    required: true
  })
}

class UploadCommand extends Command {

  async run () {
    const {token, host, dist} = this.parse(UploadCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    const config = await readChannelConfig({source: dist})

    await liApi.uploadDraft({host, token, channelConfig: config})
      .then((result) => {
        resultReporter(result, this.log)
      })
      .catch(reportError)
  }
}

UploadCommand.description = description
UploadCommand.flags = commandFlags
module.exports = UploadCommand
