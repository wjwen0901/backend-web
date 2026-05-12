const assert = require('assert')
const fs = require('fs')
const path = require('path')

const source = fs.readFileSync(path.join(__dirname, '../../src/views/home/brca/order.vue'), 'utf8')

assert.ok(source.includes('ref="tableScrollTop"'))
assert.ok(source.includes('@scroll="handleTopScroll"'))
assert.ok(source.includes('ref="table"'))
assert.ok(source.includes('tableScrollWidth: 0'))
assert.ok(source.includes('scheduleTableScrollSync'))
assert.ok(source.includes('handleTopScroll'))
assert.ok(source.includes('handleTableBodyScroll'))
assert.ok(source.includes('beforeDestroy'))

console.log('brca order top scrollbar ok')
