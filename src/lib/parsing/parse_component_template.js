const cheerio = require('cheerio')
const {CLIError} = require('@oclif/errors')

const {minifyHtml} = require('../utils')

module.exports = function parseTemplate ({componentName, fileContent, options}) {
  const $ = cheerio.load(fileContent) // -> use livingdocs instead?

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
    throw templateParseError(`invalid script block: ${parseError}`)
  }

  const outerHtml = getTemplate($) || parseBody($)

  if (!outerHtml) {
    throw templateParseError(`No template found`)
  }

  let html
  try {
    html = minifyHtml(outerHtml, options.minifyHtml)
  } catch (err) {
    throw templateParseError(`minify error: '${err.message}`)
  }

  return new ComponentTemplate(componentName, html, config)
}


class ComponentTemplate {

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

function getTemplate ($) {
  const template = $('template')
  if (!template.length) return

  if (template.length > 1) {
    throw templateParseError(`The template contains ${template.length} <template> tags. ` +
      `There can only be one.`)
  }

  return template.html()
}

function parseBody ($) {
  // filter out comment & text nodes
  // check for one root element
  let tagCount = 0
  $('body').contents().filter(function (index, el) {
    const isTag = el.type === 'tag'
    if (isTag) tagCount += 1
    return !isTag
  }).remove()

  if (tagCount !== 1) {
    throw templateParseError(`The template contains ${tagCount} root elements. ` +
      `Templates can only have one root element.`)
  }

  return $('body').html()
}

function templateParseError (msg) {
  const error = new CLIError(msg)
  error.name = 'TemplateParseError'
  return error
}
