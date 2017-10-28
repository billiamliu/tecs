require('./polyfill')

module.exports = function (binaryTable, symbolTable, code) {
  initSymbols(symbolTable, code)

  code = code.filter(({category}) => category !== 'L')

  return translate(binaryTable, symbolTable, code)
}

function initSymbols(symbolTable, code) {
  try {
    let skipped = 0
    code
      .forEach((line, number) => {
        if (line.category === 'L') {
          symbolTable.addEntry(line, number - skipped)
          skipped++
        }
      })

    code
      .filter(({category}) => category === 'A')
      .forEach(l => {
        symbolTable.addEntry(l)
      })
  } catch (err) {
    console.error('dependency has an error -- initSymbols: ', err)
    throw err
  }

  return true
}

function translate(bTable, symbolTable, code) {
  return code
    .filter(({category}) => category !== 'L')
    .map(c => {
      let cPrefix = '111'
      switch (c.category) {
        case 'A':
          return symbolTable.getAddress(c.symbol)
        case 'J':
          return cPrefix + '0' + bTable.comp[c.symbol] + '000' + bTable.jump[c.jump]
        case 'C':
          if (c.comp.includes('M')) {
            cPrefix += '1'
            return cPrefix + bTable.comp[c.comp] +
              calcDest(c.dest) + '000'
          }
          cPrefix += '0'
          return cPrefix + bTable.comp[c.comp] +
            calcDest(c.dest) + '000'
        default:
          throw new Error('Unknown category -- translate: ' + c.category)
      }
    })
}

function calcDest(regs) {
  let ret = ''
  ret += regs.includes('A') ? '1' : '0'
  ret += regs.includes('D') ? '1' : '0'
  ret += regs.includes('M') ? '1' : '0'
  return ret
}
