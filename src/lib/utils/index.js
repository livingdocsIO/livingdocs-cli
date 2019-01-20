// const path = require('path')
const htmlmin = require('html-minifier')

module.exports = {
  minifyHtml (html, minifyOptions = {}) {
    return minifyOptions
      ? htmlmin.minify(html, minifyOptions)
      : html.trim()
  },

  filenameToTemplatename (string) {
    const strings = string.replace(/\.[a-z]{2,4}$/, '').split('/')
    return strings[strings.length - 1]
  }

  // pathToRelativeUrl (cwd, filepath) {
  //   return filepath.replace(cwd, '').split(path.delimiter).join('/')
  // }
}
