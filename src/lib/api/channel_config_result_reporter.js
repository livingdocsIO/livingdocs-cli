const chalk = require('chalk')
const dedent = require('dedent')

module.exports = function (result, log) {
  function info (msg) { log(msg) }
  function success (msg) { log(chalk.green(msg)) }
  function error (msg) { log(chalk.red(msg)) }

  if (result.ok) {
    if (!result.patches || result.patches.length === 0) {
      info(dedent`
        ✓ No Changes.
      `)
    } else {
      if (result.plan) {
        info(dedent`
          Plan
          ----
          ✓ Everything looks ok.
        `)
        info(`\nThese patches will be applied (${result.patches.length}):`)
      } else {
        success(dedent`
          ✓ Success. Channel Config Published.

            Revision: ${result.revisionNumber}
            DesignVersion: ${result.designVersion || '-'}
        `)
        info(`\nApplied Patches (${result.patches.length}):`)
      }

      for (const patch of result.patches) {
        info(` • [${patch.action}] ${patch.pointer}`)
      }
      info(``)
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
