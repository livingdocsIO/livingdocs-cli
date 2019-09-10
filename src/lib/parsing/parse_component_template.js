const cheerio = require('cheerio')
const {CLIError} = require('@oclif/errors')

const {minifyHtml} = require('../utils')

/**
 * @param componentName {string}
 * @param fileContent {string}
 * @param options {object}
 * @param options.configurationSelectors {array<string>}
 *   - e.g 'script[type=livingdocs-config]'
 * @param options.minifyHtml {?boolean}
 * @return {object}
 */
module.exports = function parseComponentTemplate ({componentName, fileContent, options}) {
  try {
    return parse({componentName, fileContent, options})
  } catch (err) {
    throw templateParseError(`file '${componentName}': ${err.message}`)
  }
}

function parse ({componentName, fileContent, options}) {
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

  const outerHtml = getTemplate($('template')) || getHtml($('body'))

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

function getTemplate ($template) {
  if (!$template.length) return

  if ($template.length > 1) {
    throw templateParseError(`The template contains ${$template.length} <template> tags. ` +
      `There can only be one.`)
  }

  // Looks ugly. I know...
  $template = cheerio.load($template.html())('body')

  return getHtml($template)
}

function getHtml ($elem) {
  const {nonElemChildren, tagCount} = parseChildren($elem)

  nonElemChildren.remove()

  if (tagCount !== 1) {
    throw templateParseError(`The template contains ${tagCount} root elements. ` +
      `Templates can only have one root element.`)
  }

  return $elem.html()
}

// filter out comment & text nodes
// check for one root element
function parseChildren ($elem) {
  let tagCount = 0
  const nonElemChildren = $elem.contents().filter(function (index, el) {
    const isTag = el.type === 'tag'
    if (isTag) tagCount += 1
    return !isTag
  })

  return {
    nonElemChildren,
    tagCount
  }
}

function templateParseError (msg) {
  const error = new CLIError(msg)
  error.name = 'TemplateParseError'
  return error
}
