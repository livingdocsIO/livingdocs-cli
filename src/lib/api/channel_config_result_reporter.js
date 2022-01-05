const chalk = require('chalk')
const dedent = require('dedent')
const diff = require('diff')

module.exports = function (result, log) {
  function info (msg) { log(msg) }
  function success (msg) { log(chalk.green(msg)) }
  function error (msg) { log(chalk.red(msg)) }
  function print (obj) { return JSON.stringify(obj, null, 2) }

  function colorUpdate (entry) {
    if (entry.added) return chalk.green(entry.value)
    if (entry.removed) return chalk.red(entry.value)
    return entry.value
  }

  function calcDiff (patch) {

    if (patch.action === 'update') {
      const items = diff.diffJson(patch.valueBefore || '', patch.value)
      return items.reduce((str, item) => {
        return `${str}${colorUpdate(item)}`
      }, '')
    } else if (patch.action === 'remove') {
      return patch.valueBefore
        ? chalk.red(print(patch.valueBefore))
        : ''
    } else {
      return chalk.green(print(patch.value))
    }
  }

  if (result.ok) {
    const count = result.patches.length
    if (!result.patches || count === 0) {
      info(dedent`
        ✓ No Changes.
      `)
    } else {
      if (result.plan) {
        info(dedent`
          Plan
          ----
        `)
        info(`\nPatches (${count}):\n`)
      } else {
        success(dedent`
          ✓ Success. Channel Config Published.

            Revision: ${result.revisionNumber}
            DesignVersion: ${result.designVersion || '-'}
        `)
        info(`\nApplied Patches (${result.patches.length}):`)
      }

      for (const patch of result.patches) {
        info(`• [${patch.action}] ${patch.pointer}`)
        info(`${calcDiff(patch)}`)
      }


      if (count === 1) info(`\n✓ The patch looks good.\n`)
      else info(`\n✓ All ${count} patches look good.\n`)
    }

    return
  }

  if (result.schemaErrors) {
    error(`\nInvalid JSON: there have been json schema errors`)

    for (const err of result.schemaErrors) {
      error(` • ${err.pointer}: ${err.message}`)
    }
  }

  if (result.violations) {
    error(`\nInvalid Config: there are invliad configuration properties`)

    for (const err of result.violations) {
      error(` • ${err.pointer}: ${err.message}`)
    }
  }
}
