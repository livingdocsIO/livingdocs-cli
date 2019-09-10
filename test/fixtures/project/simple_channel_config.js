module.exports = {
  v: 2,
  settings: {
    handle: 'test-config',
    editMode: 'default'
  },
  contentTypes: [{
    handle: 'article',
    documentType: 'article',
    info: {
      label: 'Regular Article'
    }
  }],
  designSettings: {
    componentGroups: [{
      name: 'content',
      label: 'Components',
      components: ['title']
    }]
  },
  components: [{
    name: 'title',
    label: 'Title',
    html: '<h2 doc-editable="title">\n  Title\n</h2>'
  }]
}
