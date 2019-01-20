const url = require('url')
const {Command, flags} = require('@oclif/command')

const upload = require('../../lib/upload')
const sharedFlags = require('../../lib/shared_flags')

class UploadCommand extends Command {

  async run () {
    const {token, host, assets} = this.parse(UploadCommand).flags

    const origin = this.parseUrl(host).origin
    if (!origin) return
    if (!assets) {
      this.error(`missing param assets`)
    }

    await upload.uploadAssets({
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


UploadCommand.description = `Upload a Component Library ` +
  `to your project`

UploadCommand.flags = {
  token: sharedFlags.token,
  host: sharedFlags.host,
  // token: flags.string({
  //   char: 't',
  //   env: 'LI_TOKEN',
  //   description: 'The Access Token to your project (needs write permission).\n' +
  //     `Can be set by the environment variable 'LI_TOKEN'.`
  // }),
  // host: flags.string({
  //   char: 'h',
  //   default: 'localhost:9090',
  //   description: 'The host where to upload to.'
  // }),
  components: flags.string({
    char: 'c',
    description: 'The folder with your .html component templates'
  }),
  assets: flags.string({
    char: 'a',
    description: 'The folder where you asset files are located.'
  })
}

module.exports = UploadCommand
