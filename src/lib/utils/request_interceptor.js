const cookie = require('cookie')
module.exports = {
  async requestInterceptor (config) {
    const cookies = await config.jar.getCookies(config.url)
    const cookiesEntries = cookies.map((c) => [c.key, c.value])

    const cookieHeader = Array.from(new Map(cookiesEntries))
      .map(([key, value]) => cookie.serialize(key, value))
      .join('; ')
    config.headers.common['cookie'] = cookieHeader
    return config
  },

  async responseInterceptor (response) {
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders !== undefined) {
      for (const setCookie of setCookieHeaders) {
        await response.config.jar.setCookie(setCookie, response.config.url)
      }
    }

    return response
  }
}
