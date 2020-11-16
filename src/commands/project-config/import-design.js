const chalk = require('chalk')
const {Command} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const writeConfig = require('../../lib/write_channel_config')
const readChannelConfig = require('../../lib/read_channel_config')
const assertDistFolder = require('../../lib/cli/assert_dist_folder')
const downloadDesign = require('../../lib/utils/download_design')
const parseDesignV2 = require('../../lib/parsing/parse_design_to_v2')

const description = `Import a design into a given project configuration`
const commandFlags = {
  project: sharedFlags.project,
  env: sharedFlags.env,
  dist: {...sharedFlags.dist, required: true},
  designUri: {...sharedFlags.designUri, required: true}
}

class ImportDesignCommand extends Command {

  async run () {
    const {dist, designUri} = this.parse(ImportDesignCommand).flags
    assertDistFolder(dist)

    let config
    try {
      config = await readChannelConfig({source: dist})
    } catch (err) {
      this.log(chalk.red('✕ Parsing Failed'))
      throw err
    }

    const design = await downloadDesign(designUri)
    const designV2 = parseDesignV2(design, this.log)

    config.components = designV2.components
    config.designSettings = designV2.designSettings

    await writeConfig({
      destination: dist,
      channelConfig: config,
      fileType: 'js',
      componentsAsHtml: false
    })

    this.log(chalk.green(`\n✓ Success. Updated Config in "${dist}" with design from
    "${designUri}".`))
  }
}

ImportDesignCommand.description = description
ImportDesignCommand.flags = commandFlags
module.exports = ImportDesignCommand
