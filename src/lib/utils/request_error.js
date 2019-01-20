// consider: we could handle this in the SDK (LP)
module.exports = function requestError (res, requestBody, message) {
  if (res.statusCode === 400) {
    message = `${message || 'Server validation Error'}:\n`

  } else {
    message = `${message || (`Unhandled response code ${res.statusCode}`)}:\n`
  }

  let postfix = ''
  if (res.body != null ? res.body.error_details : undefined) {
    for (const key in res.body.error_details) {
      const msg = res.body.error_details[key]
      postfix += `${key}: ${msg}\n`
    }
    postfix = `    ${postfix.split('\n').join('\n    ')}`
  }

  const err = new Error(message + postfix)
  delete err.stack
  err.status = res.statusCode
  err.request = {
    url: res.request.uri.href,
    method: res.request.method,
    headers: res.request.headers
  }

  if (requestBody) {
    err.request.body = requestBody
  }

  err.response = res.toJSON()
  // err.body = err.response.body
  delete err.response.request
  // delete err.response.body

  return err
}
