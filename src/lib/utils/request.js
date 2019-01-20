const log = require('npmlog')
const request = require('request-promise-native')
const parseWarningHeader = require('warning-header-parser')

module.exports = async function (config) {
  const response = await request(config)

  if (response && response.headers.warning) {
    logWarningHeaders(response.headers.warning, response.request)
  }

  return response
}

function logWarningHeaders (warningHeader, req) {
  const warnings = parseWarningHeader(warningHeader).map(w => w.message)
  const msg = [`Warnings on ${req.method} ${req.href}:`].concat(warnings).join('\n  ')
  return log.warn('request', msg)
}
