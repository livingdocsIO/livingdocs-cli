const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const {buildDesign} = require('../../lib/build_design')
const sharedFlags = require('../../lib/cli/shared_flags')
const {uploadAssets} = require('../../lib/upload_assets')
const liApi = require('../../lib/api/livingdocs_api')
const chalk = require('chalk')

const description = `Publish Design to DesignServer`
const commandFlags = {
  host: {...sharedFlags.host, required: true},
  username: sharedFlags.username,
  dist: {
    ...sharedFlags.dist,
    required: true,
    description: 'The folder to the design.'
  },
  forceUpdate: flags.boolean({
    char: 'f',
    description: 'The design name of the assets to upload',
    default: false
  })
}

class PublishDesignCommand extends Command {

  async run () {
    const {host, dist, username, forceUpdate} = this.parse(PublishDesignCommand).flags
    let inputUser
    if (!username) {
      inputUser = await cli.prompt('What is your username?')
    }

    // mask input after enter is pressed
    const password = await cli.prompt('What is your password?', {type: 'hide'})
    const {token, axiosInstance} =
      await liApi.authenticate({username: username || inputUser, password, host})
    const design = await buildDesign({designFolder: dist})

    if (design.name === undefined) this.log(chalk.red('design.name is not set'))
    if (design.version === undefined) this.log(chalk.red('design.version is not set'))

    await liApi.publishDesign({design, host, token, forceUpdate})
    await uploadAssets({folderPath: dist, host, token, design, axiosInstance})
  }
}

PublishDesignCommand.description = description
PublishDesignCommand.flags = commandFlags
module.exports = PublishDesignCommand
