const path = require('path')
const chalk = require('chalk')
const {Command, flags} = require('@oclif/command')

const loadDesigns = require('../../lib/load_designs')

class DesignServerCommand extends Command {
  static description = `Start a design server for development`

  static flags = {
    port: flags.integer({
      char: 'p',
      description: 'The port of the design-server.',
      default: 9030
    }),
    address: flags.string({
      char: 'a',
      description: 'The address of the design-server.'
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

  async run () {
    let host
    const {port, address: customAddress, verbose, dist, assets, basePath} =
      this.parse(DesignServerCommand).flags

    const fastify = require('fastify')({
      logger: verbose ? {prettyPrint: true} : undefined
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
        reply.status(404).send({error: 'Not Found'})
        return
      }

      reply.send({versions: Object.keys(design.versions)})
    })

    fastify.get('/designs/:designName/:version', async (request, reply) => {
      const {designName, version} = request.params

      const designs = await initDesigns({dist})
      const design = designs[designName]
      if (!design) {
        reply.status(404).send({error: 'Not Found'})
        return
      }

      const designConfig = design.versions[version]
      if (!designConfig) {
        reply.status(404).send({error: 'Not Found'})
        return
      }

      const designBasePath = basePath || `${host}/designs/${designName}/${version}`
      if (
        typeof designConfig.assets === 'object' &&
        !designConfig.assets.basePath
      ) {
        designConfig.assets.basePath = designBasePath
      }

      if (
        typeof designConfig.designSettings?.assets === 'object' &&
        !designConfig.designSettings.assets.basePath
      ) {
        designConfig.designSettings.assets.basePath = designBasePath
      }

      reply.send(designConfig)
    })

    fastify.get('/designs/:designName/:version/*', (request, reply) => {
      const filePath = request.params['*']
      reply.sendFile(filePath)
    })

    fastify.listen(port, customAddress, (err, address) => {
      if (err) throw err
      host = address
      if (!verbose) this.log(chalk.green(`server listening at ${address}`))
    })
  }
}

async function initDesigns ({dist}) {
  const designConfigs = await loadDesigns({source: dist})

  if (!designConfigs.length) return {}

  return designConfigs.reduce((acc, designConfig) => {
    const {name, version} = designConfig
    acc[name] = acc[name] || {name, versions: {}}
    acc[name].versions[version] = designConfig
    return acc
  }, {})
}

function setupStaticFolder ({fastify, assets}) {
  fastify.register(require('fastify-static'), {
    root: path.resolve(assets),
    prefix: '/assets/' // optional: default '/'
  })
}

module.exports = DesignServerCommand
