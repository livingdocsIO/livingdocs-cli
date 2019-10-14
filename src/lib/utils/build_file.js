module.exports = function buildFile () {
  let content = ''
  let entry
  let line = 0

  function newLine (level) {
    const addComma = entry
    entry = null
    line += 1

    return line > 1
      ? `${addComma === level ? ',' : ''}\n`
      : ''
  }

  return {
    get content () { return content },

    line (code, level) {
      content += `${newLine(level)}${code}`
    },

    entry (code, level) {
      content += `${newLine(level)}${code}`
      entry = level
    },

    end () {
      content += '\n'
    }
  }
}
