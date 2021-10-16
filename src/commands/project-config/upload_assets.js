// WIP
const url = require('url')
const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const {authenticate} = require('../../lib/utils/li_authenticate')
const sharedFlags = require('../../lib/cli/shared_flags')
const {uploadAssets} = require('../../lib/upload_assets')

const description = `Upload assets to your project`
const commandFlags = {
  host: sharedFlags.host,
  username: sharedFlags.username,
  assets: flags.string({
    char: 'a',
    description: 'The folder where you asset files are located.'
  }),
  designName: flags.string({
    char: 'dn',
    description: 'The design name of the assets to upload'
  }),
  designVersion: flags.string({
    char: 'dv',
    description: 'The design version of the assets to upload'
  })
}

class UploadAssetsCommand extends Command {
  static hidden = true
  static description = `Upload assets to your project`
  static flags = {
    token: {...sharedFlags.configWriteToken, required: true},
    host: sharedFlags.host,
    assets: flags.string({
      char: 'a',
      description: 'The folder where you asset files are located.'
    })
  }

  async run () {
    const {host, assets, username, designName, designVersion} =
      this.parse(UploadAssetsCommand).flags

    const origin = this.parseUrl(host).origin
    if (!origin) return
    if (!assets) {
      this.error(`missing param assets`)
    }

    let inputUser
    if (!username) {
      inputUser = await cli.prompt('What is your username?')
    }

    // mask input after enter is pressed
    const password = await cli.prompt('What is your password?', {type: 'hide'})
    const {token, axiosInstance} =
      await authenticate({username: username || inputUser, password, host})
    await uploadAssets({
      folderPath: assets,
      host: origin,
      token,
      design: {name: designName, version: designVersion},
      axiosInstance
    })
  }

  parseUrl (host) {
    try {
      return new url.URL(host)
    } catch (err) {
      this.error(`Error parsing host: '${err}'`)
      return {}
    }
  }

}

module.exports = UploadAssetsCommand
