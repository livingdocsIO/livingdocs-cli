const designV1 = require('../fixtures/designs/v1_design.json')
const parseDesign = require('../../src/lib/parsing/parse_design_to_v2')

const {expect, test} = require('../support/test_setup')

describe('parse design v1 to v2', function () {
  test
    .stdout()
    .tmpdir()
    .it('parse a v1 design to v2', (ctx) => {
      const designV2 = parseDesign(designV1, console.log)
      // concatenate the basePath with relative paths in assets
      expect(designV2.designSettings.assets).to.deep.equal({
        basePath: 'https://cdn-jbxbgjz.livingdocs.io/designs/living-stories/0.0.2',
        css: ['https://cdn-jbxbgjz.livingdocs.io/designs/living-stories/0.0.2/styles.css'],
        js: ['https://cdn-jbxbgjz.livingdocs.io/designs/living-stories/0.0.2/scripts.js']
      })
      // array-ify componentProperties
      expect(designV2.designSettings.componentProperties.length).to.equal(12)
      // correctly array-ify component directives
      expect(designV2.components[3].directives).to.deep.have.same.members([{
        type: 'container',
        name: 'header',
        allowedChildren: ['head', 'head-wide'],
        defaultComponents: {
          paragraph: 'paragraph',
          image: 'image',
          html: 'free-html'
        }
      }, {
        type: 'container',
        name: 'main',
        allowedChildren: ['free-html', 'iframe', 'tweet', 'subtitle', 'image',
          'image-row', 'image-full-bleed', 'bullet-list', 'event-list', 'paragraph',
          'separator', 'quote', 'whole', 'teaser-author', 'gallery-container',
          'teaser-gallery-hero', 'teaser-gallery', 'teaser-card'],
        defaultComponents: {
          paragraph: 'paragraph',
          image: 'image',
          html: 'free-html'
        }
      }])
    })
})
