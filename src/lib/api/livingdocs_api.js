const _axios = require('axios')
const {CookieJar} = require('tough-cookie')
const jar = new CookieJar()
// use the jar cookie for axios to support the login of a user
const axiosJarInstance = _axios.create({jar})
const {requestInterceptor, responseInterceptor} = require('../utils/request_interceptor')
axiosJarInstance.interceptors.request.use(requestInterceptor)
axiosJarInstance.interceptors.response.use(responseInterceptor)

// down- and upload to the ☁️
module.exports = {

  // ChannelConfig
  // -------------

  async download ({host, token}) {
    return axios(host, token).get('/api/v1/channelConfig')
      .then((response) => {
        return response.data
      })

  },

  async plan ({host, token, channelConfig}) {
    return axios(host, token).post('/api/v1/channelConfig', {
      plan: true,
      channelConfig
    })
      .then((response) => {
        return response.data
      })

  },

  async publish ({host, token, channelConfig}) {
    return axios(host, token).post('/api/v1/channelConfig', {
      plan: false,
      channelConfig
    })
      .then((response) => {
        return response.data
      })
  },

  // At the moment the user cookie is needed. So the authenticate should be called first.
  async publishDesign ({token, host, design, forceUpdate}) {
    const forceUpdateValue = `?force=${forceUpdate ? 'true' : 'false'}`
    const designUrl = `${host}/designs/${design.name}/${design.version}${forceUpdateValue}`
    const response = await axiosJarInstance({
      withCredentials: true,
      method: 'put',
      url: designUrl,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: design
    })

    return response
  },

  async authenticate ({host, username, password}) {
    const res = await axiosJarInstance({
      withCredentials: true,
      method: 'post',
      url: `${host}/auth/local/login`,
      data: {username, password}
    })
    return {token: res.data.access_token, axiosInstance: axiosJarInstance}
  }
}

function axios (host, token) {
  const axiosInstance = _axios.create({
    baseURL: host,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  require('./log_warning_headers')(axiosInstance)

  return axiosInstance
}
