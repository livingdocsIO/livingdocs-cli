const _axios = require('axios')

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

  async listDrafts ({host, token}) {
    return axios(host, token).get('/api/v1/channelConfig/drafts')
      .then((response) => {
        return response.data
      })
  },

  async uploadDraft ({host, token, draftName, channelConfig}) {
    return axios(host, token).put('/api/v1/channelConfig/drafts', {
      draftName,
      channelConfig
    })
      .then((response) => {
        return response.data
      })
  }
}

function axios (host, token) {
  const axiosInstance = _axios.create({
    baseURL: host,
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  require('./log_warning_headers')(axiosInstance)

  return axiosInstance
}
