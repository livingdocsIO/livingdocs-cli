const path = require('path')
const fs = require('fs-extra')
const beautify = require('js-beautify').js
const globby = require('globby')
const _kebabCase = require('lodash/kebabCase')
const _without = require('lodash/without')
const {stringify: stringifyjs} = require('javascript-stringify')

const buildFile = require('./utils/build_file')
const {indentString} = require('./utils')

module.exports = async function ({destination, projectConfig, fileType, componentsAsHtml}) {
  const rootFolder = path.resolve(destination)
  const writeHtml = fileType === 'js/html'
  const baseRevision = projectConfig.$baseRevision

  await fs.ensureDir(rootFolder)

  if (fileType === 'json') {
    return writeJsonFile(`${rootFolder}/index.json`, projectConfig)
  }

  fileType = 'js'

  const files = []
  async function writeFile (fileName, data) {
    fs.writeFile(fileName, data)
    files.push(fileName)
  }

  const indexFile = buildFile()
  indexFile.line('module.exports = {', 0)
  indexFile.entry(`  v: 2`, 1)
  if (baseRevision) {
    indexFile.entry(`  $baseRevision: ${baseRevision}`, 1)
  }
  indexFile.line('', 1)

  for (const key in projectConfig) {
    if (key === 'v') continue
    if (key === '$baseRevision') continue

    const prop = projectConfig[key]

    if (Array.isArray(prop)) {
      const folder = `${rootFolder}/${_kebabCase(key)}`
      await fs.ensureDir(folder)

      indexFile.line(`  ${key}: [`, 1)
      for (let i = 0; i < prop.length; i++) {
        const property = prop[i]
        const propertyKey = getPropertyKey(property)
        if (key === 'components' && writeHtml) {
          const fileName = `${folder}/${propertyKey}.html`
          await writeComponentFile(fileName, property, writeFile)
          indexFile.entry(`    './${_kebabCase(key)}/${propertyKey}.html'`, 2)
        } else {
          const fileName = `${folder}/${propertyKey}.${fileType}`
          await writeJsFile(fileName, property, writeFile)
          indexFile.entry(`    require('./${_kebabCase(key)}/${propertyKey}')`, 2)
        }
      }
      indexFile.entry(`  ]`, 1)
    } else {
      const fileName = `${rootFolder}/${_kebabCase(key)}.${fileType}`
      await writeJsFile(fileName, prop, writeFile)
      indexFile.entry(`  ${key}: require('./${_kebabCase(key)}')`, 1)
    }
  }

  indexFile.line('}', 0)
  indexFile.end()

  await writeFile(`${rootFolder}/index.js`, indexFile.content, writeFile)

  const allFiles = await globby(`${rootFolder}/**`)
  const oldFiles = _without(allFiles, ...files)

  return {files, fileCount: files.length, oldFiles}
}

function getPropertyKey (property) {
  const {id, handle, name} = property
  const key = handle || id || name
  return _kebabCase(key)
}

async function writeJsFile (fileName, data, writeFile) {
  const code = `module.exports = ${stringifyjs(data)}`
  const niceCode = beautify(code, {
    indent_size: 2,
    end_with_newline: true
  })

  await writeFile(fileName, niceCode)
}

async function writeComponentFile (fileName, data, writeFile) {
  const html = data.html
  delete data.html
  const config = JSON.stringify(data, undefined, 2)

  let htmlFile = ''
  htmlFile += '<script type="livingdocs-config">\n'
  htmlFile += indentString(config, 2)
  htmlFile += '\n</script>\n'
  htmlFile += '\n'
  htmlFile += '<template>\n'
  htmlFile += indentString(html, 2)
  htmlFile += '\n</template>\n'

  await writeFile(fileName, htmlFile)
}

async function writeJsonFile (fileName, data) {
  await fs.writeJson(fileName, data, {spaces: 2})
  return {
    files: [fileName],
    fileCount: 1
  }
}
