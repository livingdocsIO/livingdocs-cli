const chalk = require('chalk')
const {Command} = require('@oclif/command')

const description = `Print current CLI configuration`
const commandFlags = {}

class ListConfigCommand extends Command {

  async run () {
    this.printVar(`LI_HOST`)
    this.printVar(`LI_TOKEN`)
    this.printVar(`LI_DIST_FOLDER`)
  }

  printVar (name) {
    const varObj = getVar(name)

    this.log(chalk.green(`${name}`), chalk.gray(` (source: ${varObj.source})`))
    this.log(chalk.gray(`${varObj.value}\n`))
  }
}

function getVar (key) {
  if (process.env[key]) {
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
      source: 'not set'
    }
  }
}

const defaults = {
  LI_HOST: 'http://localhost:9090'
}

ListConfigCommand.description = description
ListConfigCommand.flags = commandFlags
module.exports = ListConfigCommand
