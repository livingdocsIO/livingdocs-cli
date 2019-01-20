const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const {promisify} = require('util')

const mkdirpAsync = promisify(mkdirp)
const writeFileAsync = promisify(fs.writeFile)


module.exports = async function ({destination, components, minifyJson}) {
  const spacing = minifyJson ? 0 : 2

  const json = exportJson({components, spacing})
  const jsonDest = destination

  await mkdirpAsync(path.dirname(jsonDest))
  await writeFileAsync(jsonDest, json)
}

function exportJson ({components, spacing = 0}) {
  const componentLibrary = {components}
  return JSON.stringify(componentLibrary, null, spacing)
}
