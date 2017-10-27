require('./polyfill')

module.exports = function (binaryTable, symbolTable, code) {
  initSymbols(symbolTable, code)

  code = code.filter(({category}) => category !== 'L')

  return translate(binaryTable, symbolTable, code)
}

// Sample Parsed Output
// const sample = [
//   {category: 'L', symbol: 'LOOP'},
//   {category: 'A', symbol: '2'},
//   {category: 'C', dest: ['D'], comp: 'A'},
//   {category: 'A', symbol: '3'},
//   {category: 'C', dest: ['D'], comp: 'D+A'},
//   {category: 'A', symbol: '0'},
//   {category: 'C', dest: ['A', 'M'], comp: 'D'},
//   {category: 'A', symbol: 'LOOP'},
//   {category: 'J', symbol: '0', jump: 'JMP'}
// ]

function initSymbols(symbolTable, code) {
  try {
    code.forEach((line, number) => {
      if ((line.category === 'L') || (line.category === 'A')) {
        symbolTable.addEntry(line, number)
      }
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
          return addressToBinary(symbolTable.getAddress(c.symbol))
        case 'J':
          return cPrefix + '0' + bTable.comp[c.symbol] + '000' + bTable.jump[c.jump]
        case 'C':
          if (c.dest.includes('M') || c.comp.includes('M')) {
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

function addressToBinary(addr) {
  return Number(addr)
    .toString(2)
    .padStart(16, '0')
}
