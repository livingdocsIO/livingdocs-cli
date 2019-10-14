const {expect, test} = require('../support/test_setup')

describe('cli-config:print', function () {

  test
    .stdout()
    .command('cli-config:print'.split(' '))
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
    .command('cli-config:print'.split(' '))
    .it('prints the config', (ctx) => {
      expect(ctx.stdout).to.contain('LI_HOST  (source: environment variable)')
      expect(ctx.stdout).to.contain('https://test.livingdocs.io')
      expect(ctx.stdout).to.contain('LI_TOKEN  (source: environment variable)')
      expect(ctx.stdout).to.contain('my-token')
    })
})
