const chalk = require('chalk')
const dedent = require('dedent')
const _ = require('lodash')
const {parseComponent, design: designCache} = require('../framework/livingdocs-framework')

module.exports = function (design, log) {
  if (design.v === 2) return design // already v2, nothing to do
  const parsedDesignV1 = designCache.load(design)
  const parsedDesign = {
    v: 2,
    designSettings: {
      assets: {
        basePath: _.get(design, 'assets.basePath'),
        css: _.map(_.get(design, 'assets.css', []), (css) => {
          if (css.match(/(http(s)?:)?\/\//)) return css
          const basePath = `${_.get(design, 'assets.basePath')}/`
          // eslint-disable-next-line
          const url = new URL(css, basePath)
          return url.href
        }),
        js: _.map(_.get(design, 'assets.js', []), (css) => {
          if (css.match(/(http(s)?:)?\/\//)) return css
          const basePath = `${_.get(design, 'assets.basePath')}/`
          // eslint-disable-next-line
          const url = new URL(css, basePath)
          return url.href
        })
      },
      componentGroups: _.reduce(design.layouts, (acc, layout) => {
        _.each(layout.groups, group => {
          const name = _.toLower(group.label)
          let groupEntry = _.find(acc, g => g.name === name)
          if (!groupEntry) {
            groupEntry = {label: group.label, name, components: []}
            acc.push(groupEntry)
          }
          groupEntry.components = _.union(groupEntry.components, group.components)
        })
        return acc
      }, []),
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
        const {structure} = parseComponent(componentV1, parsedDesignV1)
        const cleaned = []
        structure.directives.each((d) => {
          // change the properties property of a doc-style directive to an array
          if (d.type === 'style') {
            d.properties = _.keys(d.properties)
          }
          // change the image ratios to just contain the name
          if (d.type === 'image') {
            d.imageRatios = _.map(d.imageRatios, i => i.name)
          }
          cleaned.push(_.omit(d, ['index']))
        })
        componentV2.directives = cleaned
      } catch (e) {
        log(chalk.red(dedent`
          ✕ Component Parse Error
            "${componentV1.name}":
            ${e.message}`
        ))
      }
    }

    return componentV2
  })

  return parsedDesign
}
