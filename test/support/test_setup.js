const os = require('os')
const fs = require('fs')
const path = require('path')
const nanoid = require('nanoid')
const rimraf = require('rimraf')

const {expect, test} = require('@oclif/test')

const cliTest = test.register('tmpdir', (folderName) => {

  return {
    run (ctx) {
      ctx.tmpdir = createTempFolder(folderName)
      process.env.LI_DIST_FOLDER = ctx.tmpdir
    },
    finally (ctx) {
      process.env.LI_DIST_FOLDER = undefined
      removeTempFolder(ctx.tmpdir)
    }
  }
})

module.exports = {expect, test: cliTest}

// there may be some quirks with tmpdir: https://github.com/nodejs/node/issues/11422
// ...just so you know.
function createTempFolder (folderName = nanoid(10)) {
  const tmp = os.tmpdir()
  const tmpFolder = path.normalize(`${tmp}/${folderName}`)

  fs.mkdirSync(tmpFolder, 0o777)

  return tmpFolder
}

function removeTempFolder (tmpFolder) {
  rimraf.sync(tmpFolder)
}
