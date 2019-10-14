

const fs = require('fs-extra')
const path = require('path')


module.exports = async function ({source, revisionNumberBefore, revisionNumber}) {
  if (!revisionNumberBefore || !revisionNumber) return
  const rootFolder = path.resolve(source)

  function replaceRevisionNumber (fileName, key) {
    const indexFile = `${rootFolder}/${fileName}`
    return fs.readFile(indexFile, 'utf8')
      .catch(() => false)
      .then((data) => {
        if (data === false) return

        const newData = data.replace(`${key}: ${revisionNumberBefore}`,
          `${key}: ${revisionNumber}`)

        return fs.writeFile(indexFile, newData)
      })
  }

  await replaceRevisionNumber('index.js', '$baseRevision')
  await replaceRevisionNumber('index.json', '"$baseRevision"')
}
