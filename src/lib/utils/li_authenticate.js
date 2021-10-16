const axios = require('axios')
const {CookieJar} = require('tough-cookie')
const jar = new CookieJar()
const axiosInstance = axios.create({jar})
const {requestInterceptor, responseInterceptor} = require('./request_interceptor')
axiosInstance.interceptors.request.use(requestInterceptor)
axiosInstance.interceptors.response.use(responseInterceptor)

module.exports = {
  async authenticate ({host, username, password}) {
    const res = await axiosInstance({
      withCredentials: true,
      method: 'post',
      url: `${host}/auth/local/login`,
      data: {username, password}
    })
    return {token: res.data.access_token, axiosInstance}
  }
}
