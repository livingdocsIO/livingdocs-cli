const path = require('path')
const _map = require('lodash/map')
const parseComponents = require('./parsing/parse_components')

module.exports = async function ({source}) {
  const {rootFolder, projectConfig} = loadProjectConfig(source)

  if (projectConfig.components) {
    let needsLoading = false
    const filePaths = _map(projectConfig.components, (component) => {
      if (typeof component === 'string') {
        needsLoading = true
        const filePath = path.resolve(rootFolder, component)
        return filePath
      }
    })

    if (needsLoading) {
      const {components} = await parseComponents({filePaths})
      projectConfig.components = components
    }
  }
  return projectConfig
}

function loadProjectConfig (source) {
  try {
    const rootFolder = path.resolve(source)
    const projectConfig = require(rootFolder)
    return {rootFolder, projectConfig}
  } catch (err) {
    throw new Error(`Could not load projectConfig from path '${source}'.
      Error Stack: ${err.stack}
      Error: ${err.message}`)
  }
}
