const path = require('path')
const {Command, flags} = require('@oclif/command')

const sharedFlags = require('../../lib/cli/shared_flags')
const parseComponents = require('../../lib/parsing/parse_components')
const writeComponentLibrary = require('../../lib/write_component_library')

class BuildCommand extends Command {
  static description = `Build a Component Library JSON file`

  static flags = {
    src: flags.string({
      char: 's',
      description: 'The folder with your .html component templates'
    }),
    dist: sharedFlags.dist
  }

  async run () {
    const {src, dist} = this.parse(BuildCommand).flags

    const defaultFilename = 'component-library.json'
    const parsedPath = path.parse(dist)

    const destination = !parsedPath.ext
      ? path.join(dist, defaultFilename)
      : dist

    const {components} = await parseComponents({src})

    await writeComponentLibrary({
      components,
      destination,
      minifyJson: false
    })

    this.log(`\n✓ Success.\nBuilding Component Library finished.\n` +
      `Parsed ${components.length} component templates.\n` +
      `\n⦿ → ${destination}`)
  }

}

module.exports = BuildCommand
