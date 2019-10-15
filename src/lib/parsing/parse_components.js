const fs = require('fs-extra')
const path = require('path')
const globby = require('globby')
const _extend = require('lodash/extend')

const {filenameToTemplatename} = require('../utils')
const parseTemplate = require('./parse_component_template')

const defaultConfig = function (config) {
  return _extend({}, {
    filePaths: undefined,
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

function allHtmlFiles (folderPath) {
  return globby(`${folderPath}/**/*.html`)
}

// How to call this:
// A) parseComponentTemplates({filePaths: [...]})
// B) parseComponentTemplates({src: 'project-folder', templatesDirectory: 'components'})
module.exports = async function parseComponentTemplates (options) {
  options = defaultConfig(options)

  let files
  if (options.filePaths) {
    files = options.filePaths
  } else {
    const templatesPath = path.join(options.src, options.templatesDirectory)
    files = await allHtmlFiles(templatesPath)
  }

  const components = []
  for (const filepath of files) {
    const templateName = filenameToTemplatename(filepath)
    const fileContent = await fs.readFile(filepath, 'utf8')

    try {
      const component = parseTemplate({
        componentName: templateName,
        fileContent,
        options
      })

      components.push(component)
    } catch (err) {
      err.message = `${err.message}\nat '${filepath}'`
      throw err
    }
  }

  return {components}
}
