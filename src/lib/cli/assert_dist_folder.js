const path = require('path')

module.exports = function checkDistFolder (dist) {
  const workingDir = process.cwd()
  if (dist && !process.env.LI_SKIP_CWD_CHECK === 'true') {
    const rootFolder = path.resolve(dist)
    if (!rootFolder.includes(workingDir)) {
      throw new Error(`Error: --dist folder must be in current working directory`)
    }
  }
  return true
}
