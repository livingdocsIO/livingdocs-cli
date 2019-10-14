const {URL} = require('url')
const htmlmin = require('html-minifier')

// const allLines = /^/gm
const nonEmptyLines = /^(?!\s*$)/gm
const trimSlashes = /^\/+|\/+$/g

module.exports = {
  minifyHtml (html, minifyOptions = {}) {
    return minifyOptions
      ? htmlmin.minify(html, minifyOptions)
      : html.trim()
  },

  filenameToTemplatename (string) {
    const strings = string.replace(/\.[a-z]{2,4}$/, '').split('/')
    return strings[strings.length - 1]
  },

  indentString (str = '', count = 2) {
    return str.replace(nonEmptyLines, ' '.repeat(count))
  },

  parseUrl (url) {
    try {
      return new URL(url)
    } catch (err) {
      this.error(`Error parsing url: '${err}'`)
      return {}
    }
  },

  concat (...parts) {
    return parts.map(p => p.replace(trimSlashes, '')).join('/')
  }

  // pathToRelativeUrl (cwd, filepath) {
  //   return filepath.replace(cwd, '').split(path.delimiter).join('/')
  // }
}
