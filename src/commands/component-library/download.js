const {Command, flags} = require('@oclif/command')
const {CLIError} = require('@oclif/errors')

const sharedFlags = require('../../lib/shared_flags')

class DownloadCommand extends Command {

  async run () {
    // const {dist} = this.parse(DownloadCommand).flags
    throw new CLIError('Not Implemented')
  }

}

DownloadCommand.description = `Download the Component Library ` +
  `from your project`

DownloadCommand.flags = {
  token: sharedFlags.token,
  host: sharedFlags.host,
  dist: flags.string({
    char: 'd',
    description: 'The folder or filename where to download to.'
  })
}

module.exports = DownloadCommand
