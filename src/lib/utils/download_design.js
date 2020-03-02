const chalk = require('chalk')
const axios = require('axios')
const dedent = require('dedent')

module.exports = async function (url) {
  try {
    const {data: design} = await axios.get(url)
    return design
  } catch (e) {
    chalk.red(dedent`
      ✕ RequestError
        Design could not be parsed to JSON
        ${e.message}`
    )
  }
}
