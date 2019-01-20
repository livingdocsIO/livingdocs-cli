const {expect, test} = require('@oclif/test')

describe('component-library:build', function () {

  test
    .stdout()
    .command('component-library:build --src test/fixtures/component-library'.split(' '))
    .it('parses the component templates', (ctx) => {
      expect(ctx.stdout).to.contain('Success')
      expect(ctx.stdout).to.contain('Parsed 4 component templates')
    })
})
