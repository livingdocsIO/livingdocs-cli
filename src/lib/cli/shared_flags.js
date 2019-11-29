const {flags} = require('@oclif/command')

module.exports = {
  configWriteToken: flags.string({
    char: 't',
    env: 'LI_TOKEN',
    description: 'Access Token for your project (needs `public-api:config:write` permission).\n' +
      `Can be set by the environment variable 'LI_TOKEN'.`
  }),
  configReadToken: flags.string({
    char: 't',
    env: 'LI_TOKEN',
    description: 'Access Token for your project (needs `public-api:config:read` permission).\n' +
      `Can be set by the environment variable 'LI_TOKEN'.`
  }),
  host: flags.string({
    char: 'h',
    env: 'LI_HOST',
    default: 'http://localhost:9090',
    description: `The livingdocs host.\n` +
      `Can be set by the environment variable 'LI_HOST'.`
  }),
  dist: flags.string({
    char: 'd',
    env: 'LI_DIST_FOLDER',
    description: 'The folder where the output will be written.'
  })
}
