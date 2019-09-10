const fs = require('fs-extra')

const {expect, test} = require('../support/test_setup')

const simpleChannelConfig = require('../fixtures/project/simple_channel_config')

describe('project-config:download', function () {

  test
    .stdout()
    .tmpdir() // create tmp folder and set env variable 'LI_DIST_FOLDER'
    .env({
      LI_HOST: 'https://mock.api.localhost',
      LI_TOKEN: 'private-token',
      LI_SKIP_CWD_CHECK: 'true'
    })
    .nock('https://mock.api.localhost', api => api
      .get('/api/v1/channelConfig')
      .reply(200, simpleChannelConfig)
    )
    .command('project-config:download --format=json'.split(' '))
    .it(`downloads a channelConfig as JSON`, (ctx) => {
      const files = fs.readdirSync(ctx.tmpdir)
      expect(files).to.have.members(['index.json'])

      const jsonData = fs.readFileSync(`${ctx.tmpdir}/index.json`, 'utf8')
      const data = JSON.parse(jsonData)
      expect(data).to.deep.equal(simpleChannelConfig)
    })

  test
    .stdout()
    .tmpdir() // create tmp folder and set env variable 'LI_DIST_FOLDER'
    .env({
      LI_HOST: 'https://mock.api.localhost',
      LI_TOKEN: 'private-token',
      LI_SKIP_CWD_CHECK: 'true'
    })
    .nock('https://mock.api.localhost', api => api
      .get('/api/v1/channelConfig')
      .reply(200, simpleChannelConfig)
    )
    .command('project-config:download --format=js/html'.split(' '))
    .it(`downloads a channelConfig and writes js and html files`, (ctx) => {
      const files = fs.readdirSync(ctx.tmpdir)

      expect(files).to.have.members([
        'index.js',
        'settings.js',
        'content-types',
        'design-settings.js',
        'components'
      ])

      const indexFile = require(ctx.tmpdir)
      expect(indexFile.settings).to.deep.equal({
        handle: 'test-config',
        editMode: 'default'
      })

      expect(indexFile.components).to.deep.equal([
        './components/title.html'
      ])
    })
})
