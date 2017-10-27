const fs = require('fs')

module.exports = main

function main(fileName) {
  return fs.readFileSync(fileName, {encoding: 'utf8'})
    .split('\n')
    .map(l => l.replace(/\/\/.*/, ''))
    .map(l => l.trim())
    .filter(l => l)
    .map(categorise)
    .map(construct)
}

function categorise(inst) {
  if (/@/.test(inst)) {
    return ['A', inst.match(/@(.*)/)[1]]
  } else if (/\(/.test(inst)) {
    return ['L', inst.match(/\((.*)\)/)[1]]
  } else if (/;/.test(inst)) {
    return ['J', inst]
  } else if (/[=]/.test(inst)) {
    return ['C', inst]
  }
  throw new Error('Unknown instruction -- categorise: ' + inst)
}

function construct([category, data]) {
  switch (category) {
    case 'A':
      return {category, symbol: data}
    case 'J':
      const [_, register, jump] = data.match(/(.*);(.*)/)
      return {category, register, jump}
    case 'C':
      const [__, dest, comp] = data.match(/(.*)=(.*)/) || [null, '', null]
      return {category, dest: dest.split(''), comp}
    case 'L':
      return {category, symbol: data}
    default:
      throw new Error('Unknown category -- construct: ' + category)
  }
}
