module.exports = {
  addEntry,
  contains,
  getAddress,
  showTable
}

const symbolTable = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  SCREEN: 16384,
  KBD: 24576
}

const varAddress = (function * () {
  let index = 16
  while (index < 16384) {
    yield index++
  }
})()

// Public

function addEntry({category, symbol}, address) {
  if (category === 'L') {
    return addLabel(symbol, address)
  }

  if (category === 'A') {
    // E.g. @foo
    return addVar(symbol, address)
  }

  throw new Error('Unknown category -- addEntry: ' + category)
}

function contains(symbol) {
  return Boolean(symbolTable[symbol])
}

function getAddress(symbol) {
  return symbolTable[symbol]
}

function showTable() {
  console.log(symbolTable)
}
// Private

function addVar(sym) {
  if (symbolTable[sym]) {
    return true
  }

  symbolTable[sym] = varAddress.next().value
  return true
}

function addLabel(sym, addr) {
  if (symbolTable[sym]) {
    throw new Error('Symbol already exists -- addLabel: ' + sym)
  }

  symbolTable[sym] = addr + 1 // ROM address
  return true
}
