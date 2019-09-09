const {flags} = require('@oclif/command')

module.exports = {
  token: flags.string({
    char: 't',
    env: 'LI_TOKEN',
    description: 'The Access Token to your project (needs write permission).\n' +
      `Can be set by the environment variable 'LI_TOKEN'.`
  }),
  host: flags.string({
    char: 'h',
    env: 'LI_HOST',
    default: 'http://localhost:9090',
    description: `The livingdocs host.\n` +
      `Can be set by the environment variable 'LI_HOST'.`
  })
}
