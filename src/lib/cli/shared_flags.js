const {flags} = require('@oclif/command')

const loadCliConfig = require('./load_cli_config')

module.exports = {
  project: flags.string({
    char: 'p',
    description: 'If used configuration options are loaded from .livingdocs-cli file.'
  }),
  env: flags.string({
    char: 'e',
    description: 'If used configuration options are loaded from .livingdocs-cli file.'
  }),
  yes: flags.boolean({
    char: 'y',
    description: 'Confirm',
    default () { return !process.stdin.isTTY }
  }),
  configWriteToken: flags.string({
    char: 't',
    description: 'Access Token for your project (needs `public-api:config:write` permission).\n' +
      `Can be set by the environment variable 'LI_TOKEN'.`,

    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.token
      } else {
        return process.env.LI_TOKEN
      }
    }
  }),
  configReadToken: flags.string({
    char: 't',
    description: 'Access Token for your project (needs `public-api:config:read` permission).\n' +
      `Can be set by the environment variable 'LI_TOKEN'.`,

    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.token
      } else {
        return process.env.LI_TOKEN
      }
    }
  }),
  host: flags.string({
    char: 'h',
    description: `The livingdocs host.\n` +
      `Can be set by the environment variable 'LI_HOST'.`,

    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.host
      } else {
        return process.env.LI_HOST || 'http://localhost:9090'
      }
    }
  }),
  dist: flags.string({
    char: 'd',
    description: 'The folder where the output will be written.',

    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.distFolder
      } else {
        return process.env.LI_DIST_FOLDER
      }
    }
  }),
  source: flags.string({
    char: 's',
    description: 'The folder or filename to the project config.',

    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.sourceFolder
      } else {
        return process.env.LI_SOURCE_FOLDER
      }
    }
  }),
  designUri: flags.string({
    char: 'u',
    description: 'URL of the design to import',
    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.host
      } else {
        return process.env.LI_DESIGN_URI
      }
    }
  }),
  username: flags.string({
    char: 'us',
    description: 'username for login',
    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.username
      } else {
        return process.env.LI_USERNAME
      }
    }
  }),
  password: flags.string({
    char: 'pw',
    description: 'password for login',
    default ({options, flags: givenFlags}) {
      const sessionConfig = getCliConfig(givenFlags)
      if (sessionConfig) {
        return sessionConfig.password
      } else {
        return process.env.LI_PASSWORD
      }
    }
  })
}

function getCliConfig (givenFlags) {
  const {project, env} = givenFlags
  if (project || env) {
    return loadCliConfig({project, env}) || {}
  }
}
