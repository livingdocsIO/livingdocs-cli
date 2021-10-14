const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const {publishDesign} = require('../../lib/publish_design')
const sharedFlags = require('../../lib/cli/shared_flags')

const description = `Publish Design to DesignServer`
const commandFlags = {
  project: sharedFlags.project,
  host: {...sharedFlags.host, required: true},
  username: sharedFlags.username,
  dist: {
    ...sharedFlags.dist,
    required: true,
    description: 'The folder to the design.'
  }
}

class PublishDesignCommand extends Command {

  async run () {
    const {host, dist, username} = this.parse(PublishDesignCommand).flags
    let inputUser
    if (!username) {
      inputUser = await cli.prompt('What is your username?')
    }

    // mask input after enter is pressed
    const password = await cli.prompt('What is your password?', {type: 'hide'})
    await publishDesign({host, designFolder: dist, username: username || inputUser, password})
  }
}

PublishDesignCommand.description = description
PublishDesignCommand.flags = commandFlags
module.exports = PublishDesignCommand
