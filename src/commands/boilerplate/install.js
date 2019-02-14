const {Command, flags: Flags} = require('@oclif/command')
const {CLIError} = require('@oclif/errors')
const {color} = require('@oclif/color')
const {cli} = require('cli-ux')
const Shell = require('shelljs')

const silent = {silent: true}

const execP = (shellStr, opts) => {
  return new Promise((resolve, reject) =>
    Shell.exec(shellStr, opts, (code, stderr, stdout) => {
      if (code !== 0) {
        return reject(new CLIError(`${code}: ${stdout}`))
      }
      return resolve(code, stderr, stdout)
    })
  )
}

class InstallCommand extends Command {
  async run () {
    const {flags} = this.parse(InstallCommand)
    const {name, design, editor, server, out} = flags
    Shell.exec(`test -e ${out} || mkdir ${out}`)
    Shell.cd(out)
    const cwd = Shell.pwd()
    const designDir = `${cwd}/${name}-design`
    const editorDir = `${cwd}/${name}-editor`
    const serverDir = `${cwd}/${name}-server`

    if (!Shell.which('git')) {
      this.log(
        color.red(`No git command found. Check the docs for further instructions:
http://docs.livingdocs.io/getting-started#installing-git
`)
      )
      this.exit(1)
    }
    this.log(`
Design folder: ${designDir}
Editor folder: ${editorDir}
Server folder: ${serverDir}
      `)

    try {
      cli.action.start(color.grey('Fetching the code from GitHub'))
      await Promise.all([
        execP(`git clone ${design} ${designDir}`, silent),
        execP(`git clone ${server} ${serverDir}`, silent),
        execP(`git clone ${editor} ${editorDir}`, silent)
      ])
      cli.action.stop(color.green('Done!'))
      cli.action.start(color.grey('Installing node modules'))
      await Promise.all([
        execP(`cd ${designDir} && npm install`, silent),
        execP(`cd ${serverDir} && npm install`, silent),
        execP(`cd ${editorDir} && npm install`, silent)
      ])
      cli.action.stop(color.green('Done!'))
      Shell.exec(`export ENVIRONMENT=local`)

      cli.action.start(color.grey('Starting the Docker image'))
      await execP(`cd ${serverDir} && docker-compose up -d`, silent)
      cli.action.stop(color.green('Done!'))
      this.log(`${color.green('Installation successfull!')}

To proceed, go to your newly created server directory
and take few simple setup steps from there.

${color.blue('$ cd '.concat(editorDir))}
${color.blue('$ npx grunt setup')}
        `)
      this.exit(1)
    } catch (e) {
      this.error(color.red(e.message))
    }
  }
}

InstallCommand.description = `Install a boilerplate project on your local machine`

InstallCommand.flags = {
  design: Flags.string({
    char: 'd',
    default: 'https://github.com/livingdocsIO/magazine-example',
    description: 'A Git URL or a GitHub org/repo shorthand'
  }),
  server: Flags.string({
    char: 's',
    default: 'https://github.com/livingdocsIO/livingdocs-server-boilerplate',
    description: 'A Git URL or a GitHub org/repo shorthand'
  }),
  editor: Flags.string({
    char: 'e',
    default: 'https://github.com/livingdocsIO/livingdocs-editor-boilerplate',
    description: 'A Git URL or a GitHub org/repo shorthand'
  }),
  name: Flags.string({
    char: 'n',
    default: 'livingdocs',
    description: 'A snake case formatted name for your project'
  }),
  out: Flags.string({
    char: 'o',
    default: '.',
    description: 'The UNIX path to the folder, into which the boilerplate should get installed'
  })
}

module.exports = InstallCommand
