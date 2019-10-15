const path = require('path')
const fs = require('fs-extra')
const globby = require('globby')
const {CLIError} = require('@oclif/errors')

module.exports = async function loadDesigns ({source}) {
  const rootFolder = path.resolve(source)
  const filePaths = await allJsonFiles(rootFolder)

  const results = []
  for (const filepath of filePaths) {
    const fileContent = await fs.readFile(filepath, 'utf8')

    let config
    try {
      config = JSON.parse(fileContent) || {}
    } catch (err) {
      throw parseError(`could not parse '${filepath}': ${err.message}`)
    }

    if (config && config.name && config.version) {
      results.push(config)
    }
  }
  return results
}

function allJsonFiles (folderPath) {
  return globby(`${folderPath}/**/*.json`)
}

function parseError (msg) {
  const error = new CLIError(msg)
  error.name = 'TemplateParseError'
  return error
}
