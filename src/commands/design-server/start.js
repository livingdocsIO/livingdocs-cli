const path = require('path')
const chalk = require('chalk')
const {Command, flags} = require('@oclif/command')

const loadDesigns = require('../../lib/load_designs')

const description = `Start a design server for development`

const commandFlags = {
  port: flags.integer({
    char: 'p',
    description: 'The port of the design-server.',
    default: 9030
  }),
  dist: flags.string({
    char: 'd',
    description: 'The folder to load designs from.',
    required: true
  }),
  assets: flags.string({
    description: 'Asset folder to serve static files.'
  }),
  basePath: flags.string({
    description: 'The basePath to set in `assets.basePath`.'
  }),
  verbose: flags.boolean()
}

class DesignServerCommand extends Command {

  async run () {
    let host
    const {port, verbose, dist, assets, basePath} = this.parse(DesignServerCommand).flags

    const log = verbose && {prettyPrint: true}

    // Check at startup if any design configs can be found
    const initialDesigns = await initDesigns({dist})
    if (!Object.keys(initialDesigns).length) {
      this.log(chalk.red('✕ No design configs found'))
      return
    }

    const fastify = require('fastify')({
      logger: log
    })

    fastify.register(require('fastify-cors'))

    if (assets) setupStaticFolder({fastify, assets})

    fastify.get('/', (request, reply) => {
      reply.send({
        description: 'Livingdocs Development Design Server',
        routes: {
          '/': 'You are here',
          '/designs': 'List of available designs',
          '/designs/:designName': 'List of available versions',
          '/designs/:designName/:version': 'Design config file'
        }
      })
    })

    fastify.get('/designs', async (request, reply) => {
      const designs = await initDesigns({dist})
      reply.send({designs: Object.keys(designs)})
    })

    fastify.get('/designs/:designName', async (request, reply) => {
      const {designName} = request.params

      const designs = await initDesigns({dist})
      const design = designs[designName]
      if (!design) {
        reply.status(404)
        return
      }

      reply.send({versions: Object.keys(design.versions)})
    })

    fastify.get('/designs/:designName/:version', async (request, reply) => {
      const {designName, version} = request.params

      const designs = await initDesigns({dist})
      const design = designs[designName]
      if (!design) {
        reply.status(404)
        return
      }

      const designConfig = design.versions[version]
      if (!designConfig) {
        reply.status(404)
        return
      }

      designConfig.assets = designConfig.assets || {}
      const defaultBasePath = `${host}/designs/${designName}/${version}`
      designConfig.assets.basePath = basePath || defaultBasePath

      reply.send(designConfig)
    })

    fastify.get('/designs/:designName/:version/*', (request, reply) => {
      const filePath = request.params['*']
      reply.sendFile(filePath)
    })

    fastify.listen(port, (err, address) => {
      if (err) throw err
      host = address
      if (!log) this.log(chalk.green(`server listening at ${address}`))
    })
  }
}

async function initDesigns ({dist}) {
  const designConfigs = await loadDesigns({source: dist})

  if (!designConfigs.length) return {}

  const designs = designConfigs.reduce((acc, designConfig) => {
    const {name, version} = designConfig
    acc[name] = acc[name] || {name, versions: {}}
    acc[name].versions[version] = designConfig
    return acc
  }, {})

  return designs
}

function setupStaticFolder ({fastify, assets}) {
  fastify.register(require('fastify-static'), {
    root: path.resolve(assets),
    prefix: '/assets/' // optional: default '/'
  })
}

DesignServerCommand.description = description
DesignServerCommand.flags = commandFlags
module.exports = DesignServerCommand
