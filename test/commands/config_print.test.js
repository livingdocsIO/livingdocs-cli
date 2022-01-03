const fs = require('fs-extra')
const dedent = require('dedent')

const {expect, test} = require('../support/test_setup')

describe('config:print', function () {

  test
    .stdout()
    .command('config:print'.split(' '))
    .it('prints the config when no env vars are set', (ctx) => {
      expect(ctx.stdout).to.contain('LI_HOST  (source: default value)')
      expect(ctx.stdout).to.contain('LI_TOKEN  (source: not set)')
    })

  test
    .stdout()
    .env({
      LI_HOST: 'https://test.livingdocs.io',
      LI_TOKEN: 'my-token'
    })
    .command('config:print'.split(' '))
    .it('prints the config', (ctx) => {
      expect(ctx.stdout).to.contain('LI_HOST  (source: environment variable)')
      expect(ctx.stdout).to.contain('https://test.livingdocs.io')
      expect(ctx.stdout).to.contain('LI_TOKEN  (source: environment variable)')
      expect(ctx.stdout).to.contain('my-token')
    })

})

describe('config:print (.livingdcos-cli)', function () {

  afterEach(async () => {
    await fs.remove('./.livingdocs-cli')
  })

  test
    .do(async () => {
      // crate a .livingdocs-cli file in YAML
      const content = dedent`
        environments:
          local:
            host: 'https://dotfile:9071'
            token: 'dotfile-local-token-yaml'
            distFolder: './project-config/local'
      `
      await fs.writeFile('./.livingdocs-cli', content)
    })
    .stdout()
    .command('config:print --env local'.split(' '))
    .it('prints the variables loaded from the YAML dotfile', (ctx) => {
      expect(ctx.stdout).to.contain('LI_TOKEN  (source: .livingdocs-cli file)\n' +
        'dotfile-local-token-yaml')

    })
})
