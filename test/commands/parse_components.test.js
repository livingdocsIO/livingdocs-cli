const fs = require('fs')
const _map = require('lodash/map')
const _find = require('lodash/find')

const {expect, test} = require('../support/test_setup')

describe('component-library:build', function () {

  test
    .stdout()
    .tmpdir() // create tmp folder and set env variable 'LI_DIST_FOLDER'
    .command('component-library:build --src test/fixtures/component-library'.split(' '))
    .it('parses the component templates', (ctx) => {
      expect(ctx.stdout).to.contain('Success')
      expect(ctx.stdout).to.contain('Parsed 6 component templates')
    })

  test
    .stdout()
    .tmpdir() // create tmp folder and set env variable 'LI_DIST_FOLDER'
    .command('component-library:build --src test/fixtures/component-library'.split(' '))
    .it(`creates a 'component-library.json' in the dist folder`, (ctx) => {
      const files = fs.readdirSync(ctx.tmpdir)
      expect(files).to.have.members(['component-library.json'])

      const jsonData = fs.readFileSync(`${ctx.tmpdir}/component-library.json`, 'utf8')
      const data = JSON.parse(jsonData)

      expect(Object.keys(data)).to.have.members(['components'])
      const exportedComponents = _map(data.components, 'name')

      expect(exportedComponents).to.have.members([
        'no_name',
        'no_script_block',
        'old_script_block--from-script-block',
        'title--from-script-block',
        'with_svg',
        'template_format'
      ])

      const titleComponent = _find(data.components, {name: 'title--from-script-block'})
      expect(titleComponent).to.deep.equal({
        name: 'title--from-script-block',
        label: 'title--from-script-block',
        category: 'headers',
        html: `<h1 class="title" li-text="text">Page Title</h1>` // eslint-disable-line max-len
      })

      const svgComponent = _find(data.components, {name: 'with_svg'})
      expect(svgComponent).to.deep.equal({
        name: 'with_svg',
        label: 'with_svg',
        html: `<div class="header"><h1 class="title" li-text="text"></h1><svg width="0" height="0" style="position:absolute"><symbol viewBox="0 0 7 11" id="test"><path d="M1 1 H2"/><path d="M3 3 V2"/></symbol></svg></div>` // eslint-disable-line max-len
      })

      const templateComponent = _find(data.components, {name: 'template_format'})
      expect(templateComponent).to.deep.equal({
        name: 'template_format',
        label: 'template_format',
        category: 'headers',
        html: `<h1 li-text="text"></h1>` // eslint-disable-line max-len
      })
    })
})
