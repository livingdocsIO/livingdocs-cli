// WIP
const url = require('url')
const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')

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
    const {token, host, assets} = this.parse(UploadAssetsCommand).flags

    const origin = this.parseUrl(host).origin
    if (!origin) return
    if (!assets) {
      this.error(`missing param assets`)
    }

    await liApi.uploadAssets({
      folderPath: assets,
      host: origin,
      token
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
