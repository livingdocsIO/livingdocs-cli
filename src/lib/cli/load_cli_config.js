const fs = require('fs-extra')
const yaml = require('js-yaml')

const _get = require('lodash/get')

let cliConfig
module.exports = function getCliConfig ({project, env}) {
  if (!cliConfig) {
    cliConfig = readFile()
  }

  if (!cliConfig || !env) return {}

  // resolve alias input
  if (cliConfig.alias) {
    env = cliConfig.alias[env] || env
    project = cliConfig.alias[project] || project
  }

  return getEnvironment(project, env) || {}
}

function getEnvironment (project, env) {
  if (!project) {
    return _get(cliConfig, ['environments', env])
  } else {
    return _get(cliConfig, ['projects', project, 'environments', env])
  }
}

function readFile () {
  const workingDir = process.cwd()
  const filepath = `${workingDir}/.livingdocs-cli`

  if (fs.existsSync(filepath)) {

    const config = yaml.load(fs.readFileSync(filepath))
    return config

  }
}
