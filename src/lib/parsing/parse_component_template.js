const cheerio = require('cheerio')
const {CLIError} = require('@oclif/errors')

const {minifyHtml} = require('../utils')

module.exports = function parseTemplate ({fileName, filePath, templateString, options}) {
  const $ = cheerio.load(templateString) // -> use livingdocs instead?

  let configJson
  for (const selector of options.configurationSelectors) {
    if (!configJson) {
      configJson = $(selector).html()
    }
    $(selector).remove()
  }

  let config
  try {
    config = JSON.parse(configJson) || {}
  } catch (parseError) {
    const error = new CLIError(`at file ${filePath}\n` +
      `${parseError}`)
    error.name = 'TemplateScriptBlockParseError'
    throw error
  }

  // filter out comment & text nodes
  // check for one root element
  let tagCount = 0
  $('body').contents().filter(function (index, el) {
    const isTag = el.type === 'tag'
    if (isTag) tagCount += 1
    return !isTag
  }).remove()

  if (tagCount !== 1) {
    const msg = `at file ${filePath}\n` +
      `The template contains ${tagCount} root elements. ` +
      `Templates can only have one root element.`
    const error = new CLIError(msg)
    error.name = 'TemplateParseError'
    throw error
  }

  const outerHtml = $('body').html()

  let html
  try {
    html = minifyHtml(outerHtml, options.minifyHtml)
  } catch (error) {
    const msg = `Failed to minify the tempate '${fileName}' ` +
      `${error}`

    throw new Error(msg)
  }

  return new Template(fileName, html, config)
}


class Template {

  constructor (name, html, config) {
    this.name = name
    this.html = html

    for (const key in config) {
      const val = config[key]
      this[key] = val
    }

    this.name = config.name || this.name
    if (!this.label) { this.label = this.name }
  }
}
