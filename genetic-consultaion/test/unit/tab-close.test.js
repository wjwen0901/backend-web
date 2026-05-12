process.env.BABEL_ENV = 'test'
require('babel-register')

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const { bumpCacheVersion, bumpCacheVersions, closeTabByKey, cacheKeyForTab, isCacheableTabKey } = require('../../src/utils/tabs')

const tabs = [
  { key: '/dashboard' },
  { key: '/report/list' },
  { key: '/report/edit/12' },
  { key: '/review/detail/3' }
]

const result = closeTabByKey(tabs.slice(), '/report/edit/12', '/report/list')
assert.deepStrictEqual(result.tabs.map(item => item.key), ['/dashboard', '/report/list', '/review/detail/3'])
assert.strictEqual(result.target, '/report/list')

const fallback = closeTabByKey([{ key: '/dashboard' }], '/missing', '/review')
assert.deepStrictEqual(fallback.tabs.map(item => item.key), ['/dashboard'])
assert.strictEqual(fallback.target, '/review')

assert.strictEqual(isCacheableTabKey('/informed/edit/89845?informedId=89845'), true)
assert.strictEqual(isCacheableTabKey('/report/edit/12'), true)
assert.strictEqual(isCacheableTabKey('/product/add'), true)
assert.strictEqual(isCacheableTabKey('/review/detail/3'), true)
assert.strictEqual(isCacheableTabKey('/report/list'), false)
assert.strictEqual(isCacheableTabKey('/order/12'), false)

const versions = bumpCacheVersion({}, '/informed/edit/89845?informedId=89845')
assert.strictEqual(cacheKeyForTab('/informed/edit/89845?informedId=89845', versions), '/informed/edit/89845?informedId=89845::1')

const bumpedMany = bumpCacheVersions(versions, ['/report/list', '/report/edit/12', '/review/detail/3'])
assert.strictEqual(bumpedMany['/report/list'], undefined)
assert.strictEqual(bumpedMany['/report/edit/12'], 1)
assert.strictEqual(bumpedMany['/review/detail/3'], 1)

const informedEditSource = fs.readFileSync(path.join(__dirname, '../../src/views/home/data_collect/informed_edit.vue'), 'utf8')
assert.ok(informedEditSource.includes("import { closeCurrentTab } from '@/utils/tabs'"))
assert.ok(informedEditSource.includes("closeCurrentTab(this, '/informed/list')"))

console.log('tab close behavior ok')
