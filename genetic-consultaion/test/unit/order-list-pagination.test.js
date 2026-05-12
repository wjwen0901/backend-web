const assert = require('assert')
const fs = require('fs')
const path = require('path')

const source = fs.readFileSync(path.join(__dirname, '../../src/views/home/order/orderNew.vue'), 'utf8')

assert.ok(source.includes("import { limitPageRows } from '@/utils/pagination'"))
assert.ok(source.includes('this.orderList = limitPageRows(res.data.list, this.pageSize)'))
assert.ok(source.includes('this.orderList = limitPageRows(arr[this.pageNum].data, this.pageSize)'))

console.log('order list pagination ok')
