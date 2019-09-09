const path = require('path')

module.exports = async function ({source}) {
  const rootFolder = path.resolve(source)
  const channelConfig = require(rootFolder)

  if (channelConfig.compnents) {
    const {components} = channelConfig
    for (const component of components) {
      if (typeof component === 'string') {
        console.log('should load', component)
      }
    }
  }
  return channelConfig
}
