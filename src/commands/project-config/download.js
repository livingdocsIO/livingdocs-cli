const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const liApi = require('../../lib/api/livingdocs_api')
const writeConfig = require('../../lib/write_project_config')
const errorReporter = require('../../lib/api/error_reporter')
const assertDistFolder = require('../../lib/cli/assert_dist_folder')

class DownloadCommand extends Command {
  static description = `Download a project configuration`
  static flags = {
    project: sharedFlags.project,
    env: sharedFlags.env,
    token: {...sharedFlags.configReadToken, required: true},
    host: {...sharedFlags.host, required: true},
    dist: sharedFlags.dist,
    format: flags.string({
      options: ['js', 'js/html', 'json'],
      description: 'The format of the files written.',
      dependsOn: ['dist']
    })
  }

  async run () {
    const {token, host, dist, format} = this.parse(DownloadCommand).flags
    assertDistFolder(dist)

    const reportError = errorReporter(this.log, host, {verbose: true})

    const result = await liApi.download({host, token})
      .catch(reportError)

    if (!result) return

    if (dist) {
      const {fileCount, oldFiles} = await writeConfig({
        destination: dist,
        projectConfig: result,
        fileType: format || 'js',
        componentsAsHtml: false
      })

      this.log(chalk.green(`\n✓ Success. Config Written to '${dist}' (${fileCount} files).`))

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

module.exports = DownloadCommand
