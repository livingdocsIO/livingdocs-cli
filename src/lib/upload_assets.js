const fs = require('fs')
const path = require('path')
const log = require('npmlog')
const {promisify} = require('util')
const _each = require('lodash/each')
const axios = require('axios')
const {default: PromiseQueue} = require('p-queue')

const {concat} = require('./utils')

module.exports = {
  async uploadAssets ({folderPath, host, token}) {
    return await uploadAssets({folderPath, host, token})
  }
}

function allFilesCb (folderPath, callback) {
  const options = {
    cwd: folderPath,
    nodir: true
  }
  new Glob('**/*', options, callback) // eslint-disable-line
}

const allFiles = promisify(allFilesCb)

async function uploadAssets ({folderPath, host, token}) {
  const files = await allFiles(folderPath)

  if (!files.length) {
    log.info(`No files found in '${folderPath}'`)
    return
  }

  const assets = files.filter(file => !/^design.js(on)?$/.test(file))
  const queue = new PromiseQueue({concurrency: 10})

  _each(assets, (relativePath) => {
    queue.add(() => {
      const filePath = path.join(folderPath, relativePath)
      return uploadAsset({relativePath, filePath, host, token})
    }).then(() => {
      log.info(`Asset Uploaded (${relativePath}).`)
    }).catch((err) => {
      log.error(`Upload Error for '${relativePath}': ${formatError(err)}`)
    })
  })

  return await queue.onIdle()
    .then(() => {
      queue.pause()
      log.info('Queue is empty')
    })
}

async function uploadAsset ({relativePath, filePath, host, token}) {
  const assetApiPath = '/api/v2/content-configuration/cli-draft/assets'

  const response = await axios({
    method: 'post',
    url: `${concat(host, assetApiPath)}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    formData: {
      path: relativePath,
      file: fs.createReadStream(filePath)
    }
  })

  return response
}

function formatError (err) {
  const status = err.statusCode
  if (status === 401) {
    return `Invalid AccessToken`
  } else if (status === 403) {
    return `AccessToken requires higher privileges`
  } else {
    // if (status) {
    //   const content = JSON.parse(err.response.body)
    //   const errorDetails = content.error_details
    // }

    return err.toString()
  }
}
