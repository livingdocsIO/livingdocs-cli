const parseComponents = require('./parsing/parse_components')
const path = require('path')
const fs = require('fs-extra')

module.exports = {
  async buildDesign ({designFolder}) {
    const {components} =
      await parseComponents({src: designFolder, templatesDirectory: 'components'})

    const configFilePath = path.join(designFolder, 'config.json')
    const configFile = await fs.readFile(configFilePath, 'utf8')
    const configFileJson = JSON.parse(configFile)
    configFileJson.components = components
    return configFileJson
  }
}
