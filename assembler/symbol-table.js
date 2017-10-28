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

function addEntry({category, symbol}, address = null) {
  if (category === 'L') {
    return addLabel(symbol, address)
  }

  if (category === 'A' && directAddress(symbol) !== undefined) {
    return
  }

  if (category === 'A') {
    // E.g. @foo
    return addVar(symbol)
  }

  throw new Error('Unknown category -- addEntry: ' + category)
}

function contains(symbol) {
  return Boolean(symbolTable[symbol])
}

function directAddress(symbol) {
  if (symbol[0] === 'R' && /^\d+$/.test(symbol.slice(1))) {
    return symbol.slice(1)
  }

  if (symbol === '0' || Number.parseInt(symbol, 10)) {
    return symbol
  }

  return undefined
}

function getAddress(symbol) {
  if (directAddress(symbol)) {
    return addressToBinary(directAddress(symbol))
  }

  return addressToBinary(symbolTable[symbol])
}

function addressToBinary(addr) {
  return Number(addr)
    .toString(2)
    .padStart(16, '0')
}

function showTable() {
  console.log(symbolTable)
}
// Private

function addVar(sym) {
  if (directAddress(sym)) {
    return true
  }

  if (symbolTable[sym] !== undefined) {
    return true
  }

  symbolTable[sym] = varAddress.next().value
  return true
}

function addLabel(sym, addr) {
  if (symbolTable[sym]) {
    throw new Error('Symbol already exists -- addLabel: ' + sym)
  }

  symbolTable[sym] = addr // ROM address
  return true
}
