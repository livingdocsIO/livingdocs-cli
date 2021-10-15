const parseDesignV2 = require('./parsing/parse_design_to_v2')
const parseComponents = require('./parsing/parse_components')
const {uploadAssets} = require('./upload_assets')
const path = require('path')
const axios = require('axios')
const {CookieJar} = require('tough-cookie')
const jar = new CookieJar()
const axiosInstance = axios.create({jar})
const {requestInterceptor, responseInterceptor} = require('./utils/request_interceptor')
axiosInstance.interceptors.request.use(requestInterceptor)
axiosInstance.interceptors.response.use(responseInterceptor)

const fs = require('fs-extra')

module.exports = {
  async publishDesign ({designFolder, host, username, password}) {
    const token = await authenticate({username, password, host})
    const design = await buildDesign({designFolder})
    await publishDesign({design, host, token})
    await uploadAssets({folderPath: designFolder, host, token, design, client: axiosInstance})
  }
}

// todo:
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
// - check on name and version
// - implement force update
// - add basepath to json
// - add property to transform to V2
async function publishDesign ({design, host, token, forceUpdate}) {
  const designV2 = parseDesignV2(design, this.log)
  const forceUpdateValue = `?force=${forceUpdate ? 'true' : 'false'}`
  const designUrl = `${host}/designs/${designV2.name}/${designV2.version}${forceUpdateValue}`
  const response = await axiosInstance({
    withCredentials: true,
    method: 'put',
    url: designUrl,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: design
  })

  return response
}

async function authenticate ({host, username, password}) {
  const res = await axiosInstance({
    withCredentials: true,
    method: 'post',
    url: `${host}/auth/local/login`,
    data: {username, password}
  })
  return res.data.access_token
}
