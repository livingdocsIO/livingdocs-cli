const fs = require('fs')
const path = require('path')
const log = require('npmlog')
const {promisify} = require('util')
const _each = require('lodash/each')
const {default: PromiseQueue} = require('p-queue')
const Glob = require('glob')
const {concat} = require('./utils')
const FormData = require('form-data')

module.exports = {
  async uploadAssets ({folderPath, host, token, design, axiosInstance}) {
    return await uploadAssets({folderPath, host, token, design, axiosInstance})
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

async function uploadAssets ({folderPath, host, token, design, axiosInstance}) {
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
      return uploadAsset({relativePath, filePath, host, token, design, axiosInstance})
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

async function uploadAsset ({relativePath, filePath, host, token, design, axiosInstance}) {
  const assetApiPath = `/designs/${design.name}/${design.version}/assets`
  const url = `${concat(host, assetApiPath)}`
  const form = new FormData()
  const stream = fs.createReadStream(filePath)
  form.append('path', relativePath)
  form.append('file', stream)
  const headers = {
    Authorization: `Bearer ${token}`,
    ...form.getHeaders()
  }
  const response = await axiosInstance({
    method: 'post',
    url: url,
    data: form,
    headers: headers,
    withCredentials: true
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
    return err.toString()
  }
}
