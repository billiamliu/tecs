const fs = require('fs')

const instructionLookup = require('./instructions')
const symbolTable = require('./symbol-table')
const translator = require('./translator')
const parser = require('./parser')

const fileName = process.argv[2]

if (fileName) {
  const codeStr = fs
    .readFileSync(fileName, {encoding: 'utf8'})
    .split('\n')
    .map(l => l.replace(/\/\/.*/, ''))
    .map(l => l.trim())
    .filter(l => l)

  const rawCode = parser(codeStr)
  const binary = translator(instructionLookup, symbolTable, rawCode)

  display(codeStr, binary)
  writeToDisk(fileName, binary)
} else {
  console.log('Must supply a file name to assemble')
}

function display(raw, bin) {
  console.log('Writing binary(utf8) to disk\n---')
  let skipped = 0
  raw.forEach((r, ii) => {
    if (r.match(/\(/)) {
      skipped++
      console.log(r)
      return
    }
    console.log(' ' + r, '\t', bin[ii - skipped])
  })
}

function writeToDisk(src, code) {
  const fileName = src.split('.')[0]
  fs.writeFileSync(fileName + '.hack', prepCodeForWrite(code))
}

function prepCodeForWrite(code) {
  return code.join('\n')
}
