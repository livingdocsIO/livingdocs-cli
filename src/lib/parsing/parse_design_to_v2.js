const chalk = require('chalk')
const dedent = require('dedent')
const _ = require('lodash')
const {parseComponent} = require('../framework/livingdocs-framework')

module.exports = function (design) {
  if (design.v === 2) return design // already v2, nothing to do

  const parsedDesign = {
    v: 2,
    designSettings: {
      assets: {
        basePath: _.get(design, 'assets.basePath'),
        css: _.map(_.get(design, 'assets.css', []), (css) => {
          if (css.match(/(http(s)?:)?\/\//)) return css
          const basePath = `${_.get(design, 'assets.basePath')}/`
          const url = new URL(css, basePath)
          return url.href
        }),
        js: _.map(_.get(design, 'assets.js', []), (css) => {
          if (css.match(/(http(s)?:)?\/\//)) return css
          const basePath = `${_.get(design, 'assets.basePath')}/`
          const url = new URL(css, basePath)
          return url.href
        })
      },
      componentGroups: design.groups,
      defaultComponents: design.defaultComponents,
      fieldExtractor: design.metadata,
      prefilledComponents: _.map(_.keys(design.prefilledComponents), (k) => {
        const prefComp = design.prefilledComponents[k]
        return {
          component: k,
          content: _.map(_.keys(prefComp), (innerK) => {
            const directiveValue = prefComp[innerK]
            return {
              directive: innerK,
              value: directiveValue.value,
              type: directiveValue.type
            }
          })
        }
      }),
      componentProperties: _.map(_.keys(design.componentProperties), (k) => {
        const property = design.componentProperties[k]
        return {..._.omit(property, ['id']), name: k}
      })
    }
  }

  parsedDesign.components = _.map(design.components, (componentV1) => {
    const componentV2 = _.omit({
      ...componentV1
    }, ['directives'])
    if (!_.isEmpty(componentV1.directives)) {
      try {
        const {structure} = parseComponent(componentV1)
        const cleaned = []
        structure.directives.each((d) => {
          cleaned.push(_.omit(d, ['index']))
        })
        componentV2.directives = cleaned
      } catch (e) {
        chalk.red(dedent`
          ✕ Component Parse Error
            "${componentV1.name}":
            ${e.message}`
        )
      }
    }

    return componentV2
  })

  return parsedDesign
}
