const chalk = require('chalk')
const {Command} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const loadCliConfig = require('../../lib/cli/load_cli_config')

const defaults = {
  LI_HOST: 'http://localhost:9090'
}

class ListConfigCommand extends Command {
  static description = `Print current CLI configuration`
  static flags = {
    project: sharedFlags.project,
    env: sharedFlags.env
  }

  async run () {
    const {project, env} = this.parse(ListConfigCommand).flags
    const sessionConfig = loadCliConfig({project, env})

    this.printVar(`LI_HOST`, 'host', sessionConfig)
    this.printVar(`LI_TOKEN`, 'token', sessionConfig)
    this.printVar(`LI_SOURCE_FOLDER`, 'sourceFolder', sessionConfig)
    this.printVar(`LI_DIST_FOLDER`, 'distFolder', sessionConfig)
  }

  printVar (name, prop, sessionConfig) {
    const varObj = getVar(name, prop, sessionConfig)

    if (varObj.source) this.log(chalk.green(`${name}`), chalk.gray(` (source: ${varObj.source})`))
    else this.log(chalk.green(`${name}`))
    this.log(chalk.gray(`${varObj.value}\n`))
  }
}

function getVar (key, prop, sessionConfig) {
  if (sessionConfig?.[prop] !== undefined) {
    return {
      value: sessionConfig?.[prop],
      source: '.livingdocs-cli file'
    }
  } else if (process.env[key]) {
    return {
      value: process.env[key],
      source: 'environment variable'
    }
  } else if (defaults[key]) {
    return {
      value: defaults[key],
      source: 'default value'
    }
  } else {
    return {
      value: '[undefined]',
      source: undefined
    }
  }
}

module.exports = ListConfigCommand
