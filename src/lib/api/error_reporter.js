const chalk = require('chalk')
const dedent = require('dedent')

module.exports = function (log, host, options = {}) {

  return function printErrorOutput (err) {
    if (!err.isAxiosError) throw err
    const requestUrl = err.config.url
    const method = (err.config.method || '').toUpperCase()

    if (err.response) {
      const {status} = err.response
      const serverError = err.response.data.error
      const serverErrorDetails = err.response.data.error_details || {}

      if (status === 401) {
        log(chalk.red(dedent`
          ✕ Invalid AccessToken
            Are you using a valid token?`
        ))
        return
      } else if (status === 403) {
        log(chalk.red(dedent`
          ✕ AccessToken requires higher privileges
            Does your token have the nesessary access rights?`
        ))
        return
      } else if (status === 404) {
        log(chalk.red(dedent`
          > ${method} ${requestUrl}
          ✕ 404: Not Found`
        ))
        return
      } else if (serverError) {
        log(chalk.red(dedent`
          > ${method} ${requestUrl}
          ✕ ${status}: ${serverError}`
        ))
        if (!options.verbose) delete serverErrorDetails.stack
        log(chalk.red(JSON.stringify(serverErrorDetails, undefined, 2)))
        return
      }
    }

    if (err.code === 'ECONNREFUSED') {
      log(chalk.red(dedent`
        > ${requestUrl}
        ✕ RequestError
          ${err.message}
          Are you trying to connect to the right host?
          --host ${host}`
      ))
      return
    }

    throw err
  }
}
