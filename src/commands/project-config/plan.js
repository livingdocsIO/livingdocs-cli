const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')
const resultReporter = require('../../lib/api/channel_config_result_reporter')
const readChannelConfig = require('../../lib/read_channel_config')

const description = `See what would be updated in a publish command`
const commandFlags = {
  token: {...sharedFlags.configWriteToken, required: true},
  host: sharedFlags.host,
  dist: flags.string({
    char: 'd',
    description: 'The folder or filename where to download to.'
  })
}

class PlanCommand extends Command {

  async run () {
    const {token, host, dist} = this.parse(PlanCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    const config = await readChannelConfig({source: dist})

    await liApi.plan({host, token, channelConfig: config})
      .then((result) => {
        resultReporter(result, this.log)
      })
      .catch(reportError)
  }
}

PlanCommand.description = description
PlanCommand.flags = commandFlags
module.exports = PlanCommand
