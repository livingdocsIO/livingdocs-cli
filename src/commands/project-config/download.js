const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const writeConfig = require('../../lib/write_channel_config')
const errorReporter = require('../../lib/api/error_reporter')
const assertDistFolder = require('../../lib/cli/assert_dist_folder')

const description = `Download a project configuration`
const commandFlags = {
  token: {...sharedFlags.configReadToken, required: true},
  host: sharedFlags.host,
  dist: sharedFlags.dist,
  format: flags.string({
    options: ['js', 'js/html', 'json'],
    description: 'The format of the files written.',
    dependsOn: ['dist']
  })
}

class DownloadCommand extends Command {

  async run () {
    const {token, host, dist, format} = this.parse(DownloadCommand).flags
    assertDistFolder(dist)

    const reportError = errorReporter(this.log, host, {verbose: true})

    const result = await liApi.download({host, token})
      .catch(reportError)

    if (dist) {
      const {fileCount, oldFiles} = await writeConfig({
        destination: dist,
        channelConfig: result,
        fileType: format || 'js',
        componentsAsHtml: false
      })

      this.log(chalk.green(`\n✓ Success. Config Written to ${fileCount} files.`))

      // Remove obsolete files
      if (oldFiles && oldFiles.length) {
        const workingDir = process.cwd()
        this.log('\nObsolete Files:')
        for (const fileName of oldFiles) {
          this.log(fileName.replace(workingDir, '...'))
        }
        this.log(``)

        const answers = await inquirer.prompt([{
          name: 'deleteFiles',
          type: 'confirm',
          message: `Should these ${oldFiles.length} files be deleted?`
        }])

        if (answers.deleteFiles) {
          for (const fileName of oldFiles) {
            await fs.unlink(fileName)
          }
          this.log(chalk.green(`✓ folder pruned`))
        }
      }
    } else {
      this.log(result)
    }
  }
}

DownloadCommand.description = description
DownloadCommand.flags = commandFlags
module.exports = DownloadCommand
