const parseDesignV2 = require('./parsing/parse_design_to_v2')
const parseComponents = require('./parsing/parse_components')
const path = require('path')
const {wrapper} = require('axios-cookiejar-support')
const {CookieJar} = require('tough-cookie')
const axios = require('axios')
const jar = new CookieJar()
const client = wrapper(axios.create({jar}))

const fs = require('fs-extra')

module.exports = {
  async publishDesign ({designFolder, host, username, password}) {
    const token = await authenticate({username, password, host})
    const design = await buildDesign({designFolder})
    return await publishDesign({design, host, token})
  }
}

// todo:
// - read config.json
// - go through files in components
// - add all files to design json
async function buildDesign ({designFolder}) {
  const {components} = await parseComponents({src: designFolder, templatesDirectory: 'components'})
  const spacing = 2

  const configFilePath = path.join(designFolder, 'config.json')
  const configFile = await fs.readFile(configFilePath, 'utf8')
  const configFileJson = JSON.parse(configFile)
  configFileJson.components = components
  const designJson = JSON.stringify(configFileJson, null, spacing)
  const designFilePath = path.join(designFolder, 'design1.json')
  await fs.writeFile(designFilePath, designJson)
  return configFileJson
}

// todo:
// - upload assets
// - publish design
// - check on name and version
// - implement force update
async function publishDesign ({design, host, token}) {
  const designV2 = parseDesignV2(design, this.log)
  const designUrl = `${host}/designs/${designV2.name}/${designV2.version}`
  const response = await client({
    withCredentials: true,
    method: 'put',
    url: designUrl,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: design
  })
  console.log(response)
  return response
}

async function authenticate ({host, username, password}) {
  const res = await client({
    withCredentials: true,
    method: 'post',
    url: `${host}/auth/local/login`,
    data: {username, password}
  })
  return res.data.access_token
}
