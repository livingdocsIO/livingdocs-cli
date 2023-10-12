const chalk = require('chalk')
const _ = require('lodash')
const {Command} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const writeConfig = require('../../lib/write_project_config')
const readProjectConfig = require('../../lib/read_project_config')
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
      config = await readProjectConfig({source: dist})
    } catch (err) {
      this.log(chalk.red('✕ Parsing Failed'))
      throw err
    }

    const design = await downloadDesign(designUri)
    const designV2 = parseDesignV2(design, this.log)

    config.components = designV2.components
    config.designSettings = designV2.designSettings

    if (design.v !== 2) {
      _.each(config.contentTypes, (ct) => {
        // write wrapper on each content-type
        const matchingLayout = _.find(design.layouts, l => l.name === ct.handle)
        if (matchingLayout) ct.editorWrapper = matchingLayout.wrapper
        else ct.editorWrapper = design.wrapper
        // write components on content-type
        if (matchingLayout) {
          ct.components = _.reduce(matchingLayout.groups, (acc, g) => {
            acc = _.union(acc, _.map(g.components, c => ({name: c})))
            return acc
          }, [])
        }
        // write default content on content-type
        if (matchingLayout) ct.defaultContent = matchingLayout.defaultContent || []
      })
    }

    await writeConfig({
      destination: dist,
      projectConfig: config,
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
