const path = require('path')
const _map = require('lodash/map')
const parseComponents = require('./parsing/parse_components')

module.exports = async function ({source}) {
  const {rootFolder, channelConfig} = loadChannelConfig(source)

  if (channelConfig.components) {
    let needsLoading = false
    const filePaths = _map(channelConfig.components, (component) => {
      if (typeof component === 'string') {
        needsLoading = true
        const filePath = path.resolve(rootFolder, component)
        return filePath
      }
    })

    if (needsLoading) {
      const {components} = await parseComponents({filePaths})
      channelConfig.components = components
    }
  }
  return channelConfig
}

function loadChannelConfig (source) {
  try {
    const rootFolder = path.resolve(source)
    const channelConfig = require(rootFolder)
    return {rootFolder, channelConfig}
  } catch (err) {
    throw new Error(`Could not load channel config from path '${source}'.
      Error Stack: ${err.stack}
      Error: ${err.message}`)
  }
}
