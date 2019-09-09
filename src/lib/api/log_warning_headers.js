const log = require('npmlog')
const parseWarningHeader = require('warning-header-parser')

module.exports = function (axios) {
  axios.interceptors.response.use(function (response) {

    if (response && response.headers && response.headers.warning) {
      logWarningHeaders(response.headers.warning, response.request)
    }

    return response
  })
}

function logWarningHeaders (warningHeader, req) {
  const warnings = parseWarningHeader(warningHeader).map(w => w.message)
  const msg = [`Warnings on ${req.method} ${req.href}:`].concat(warnings).join('\n  ')
  return log.warn('request', msg)
}
