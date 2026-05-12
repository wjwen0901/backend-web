process.env.BABEL_ENV = 'test'
require('babel-register')

const assert = require('assert')

const { limitPageRows } = require('../../src/utils/pagination')

const rows = Array.from({ length: 28 }, (_, index) => ({ id: index + 1 }))

assert.strictEqual(limitPageRows(rows, 20).length, 20)
assert.strictEqual(limitPageRows(rows, 50).length, 28)
assert.deepStrictEqual(limitPageRows(null, 20), [])
assert.strictEqual(limitPageRows(rows, '20').length, 20)
assert.strictEqual(limitPageRows(rows, 0).length, 28)

console.log('pagination rows ok')
