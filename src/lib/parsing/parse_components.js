const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const {promisify} = require('util')
const Glob = require('glob').Glob

const {filenameToTemplatename} = require('../utils')
const parseTemplate = require('./parse_component_template')

const defaultConfig = function (config) {
  return _.extend({}, {
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
    const templateString = await readFileAsync(fullPath)

    const component = parseTemplate({
      fileName: templateName,
      filePath: fullPath,
      templateString,
      options
    })

    components.push(component)
  }

  return {components}
}
