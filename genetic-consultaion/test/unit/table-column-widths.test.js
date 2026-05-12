process.env.BABEL_ENV = 'test'
require('babel-register')

const assert = require('assert')

const {
  readColumnWidths,
  saveColumnWidth
} = require('../../src/utils/table-column-widths')

function fakeStorage (initial) {
  const values = Object.assign({}, initial || {})
  return {
    getItem (key) {
      return values[key] || null
    },
    setItem (key, value) {
      values[key] = value
    }
  }
}

const key = 'pc:data-collect-informed-list:columns:v1'
const defaults = { sampleCode: 120, solutionName: 230 }

assert.deepStrictEqual(readColumnWidths(fakeStorage(), key, defaults), defaults)

const storage = fakeStorage({ [key]: JSON.stringify({ sampleCode: 150 }) })
assert.deepStrictEqual(readColumnWidths(storage, key, defaults), { sampleCode: 150, solutionName: 230 })

const saved = saveColumnWidth(storage, key, defaults, 'solutionName', 420, defaults)
assert.deepStrictEqual(saved, { sampleCode: 120, solutionName: 420 })
assert.deepStrictEqual(readColumnWidths(storage, key, defaults), { sampleCode: 120, solutionName: 420 })

const ignored = saveColumnWidth(storage, key, saved, 'unknownColumn', 500, defaults)
assert.deepStrictEqual(ignored, saved)

console.log('table column widths ok')
