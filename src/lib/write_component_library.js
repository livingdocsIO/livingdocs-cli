const path = require('path')
const fs = require('fs-extra')

module.exports = async function ({destination, components, minifyJson}) {
  const spacing = minifyJson ? 0 : 2

  const json = exportJson({components, spacing})
  const jsonDest = destination

  await fs.ensureDir(path.dirname(jsonDest))
  await fs.writeFile(jsonDest, json)
}

function exportJson ({components, spacing = 0}) {
  const componentLibrary = {components}
  return JSON.stringify(componentLibrary, null, spacing)
}
