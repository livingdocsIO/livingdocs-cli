const fs = require('fs')
const path = require('path')
const Glob = require('glob').Glob
const {promisify} = require('util')
const _extend = require('lodash/extend')

const {filenameToTemplatename} = require('../utils')
const parseTemplate = require('./parse_component_template')

const defaultConfig = function (config) {
  return _extend({}, {
    src: undefined,
    dest: undefined,
    templatesDirectory: 'components',
    configurationSelectors: [
      'script[type=livingdocs-config]',
      'script[type=ld-conf]'
    ],
    minifyHtml: {
      collapseWhitespace: true,
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true
    }
  }, config)
}


// @param callback function (err, files) {}
function allHtmlFilesCb (folderPath, callback) {
  new Glob('**/*.html', {cwd: folderPath}, callback) // eslint-disable-line
}

const allHtmlFiles = promisify(allHtmlFilesCb)
const readFileAsync = promisify(fs.readFile)


module.exports = async function parseComponentTemplates (options) {
  options = defaultConfig(options)
  const templatesPath = path.join(options.src, options.templatesDirectory)

  const files = await allHtmlFiles(templatesPath)

  const components = []
  for (const filepath of files) {
    const fullPath = path.join(templatesPath, filepath)
    const templateName = filenameToTemplatename(fullPath)
    const fileContent = await readFileAsync(fullPath, 'utf8')

    try {
      const component = parseTemplate({
        componentName: templateName,
        fileContent,
        options
      })

      components.push(component)
    } catch (err) {
      err.message = `${err.message}\nat '${fullPath}'`
      throw err
    }
  }

  return {components}
}
