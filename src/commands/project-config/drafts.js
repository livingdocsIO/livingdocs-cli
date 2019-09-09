const chalk = require('chalk')
const {Command} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const errorReporter = require('../../lib/api/error_reporter')

const description = `List project configuration drafts`
const commandFlags = {
  token: {...sharedFlags.token, required: true},
  host: sharedFlags.host
}

class DraftsCommand extends Command {

  async run () {
    const {token, host} = this.parse(DraftsCommand).flags
    const reportError = errorReporter(this.log, host, {verbose: true})

    await liApi.listDrafts({host, token})
      .then((result) => {
        this.log(`Drafts:`)
        if (!result || !result.length) {
          this.log(chalk.gray(`-> 0 drafts found`))
        } else {
          for (const draftName of result) {
            this.log(` • ${draftName}`)
          }
        }
      })
      .catch(reportError)
  }
}

DraftsCommand.description = description
DraftsCommand.flags = commandFlags
module.exports = DraftsCommand
