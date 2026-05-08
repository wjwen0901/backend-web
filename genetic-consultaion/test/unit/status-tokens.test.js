require('babel-register')

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const pc = require('../../src/utils/pc')

function assertClass (text, expected) {
  assert.strictEqual(pc.tagClassOf(text), expected, text)
}

assertClass('待回寄', 'el-tag--warn')
assertClass('寄样中', 'el-tag--prog')
assert.strictEqual(pc.STATUS_MAP[4].type, 'warn')
assert.strictEqual(pc.BRCA_ORDER_STATUS_TYPE[2], 'warn')

assertClass('分析中', 'el-tag--prog')
assertClass('实验中', 'el-tag--prog')
assertClass('完全匹配', 'el-tag--succ')
assertClass('报告完成', 'el-tag--succ')
assertClass('审核通过', 'el-tag--succ')
assertClass('已申请', 'el-tag--warn')
assertClass('已发送邮件', 'el-tag--succ')
assertClass('已到帐', 'el-tag--succ')
assertClass('暂存', '')
assertClass('发布', 'el-tag--succ')
assertClass('启用', 'el-tag--succ')
assertClass('已停用', '')
assertClass('已取消', '')

const tokensCss = fs.readFileSync(path.resolve(__dirname, '../../src/assets/css/design-system/tokens.css'), 'utf8')
const overridesCss = fs.readFileSync(path.resolve(__dirname, '../../src/assets/css/design-system/element-overrides.css'), 'utf8')

assert(tokensCss.includes('--pc-succ-700:    #275E53;'))
assert(tokensCss.includes('--pc-succ-600:    #2F806E;'))
assert(tokensCss.includes('--pc-succ-100:    #EDF5F2;'))
assert(overridesCss.includes('border-color: var(--pc-succ-line);'))

function walkFiles (dir, out) {
  fs.readdirSync(dir).forEach(name => {
    const file = path.join(dir, name)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      walkFiles(file, out)
    } else if (/\.(vue|js|css)$/.test(name)) {
      out.push(file)
    }
  })
  return out
}

walkFiles(path.resolve(__dirname, '../../src'), []).forEach(file => {
  const rel = path.relative(path.resolve(__dirname, '../..'), file)
  const source = fs.readFileSync(file, 'utf8')
  assert(!/<el-tag[^>\n]*(\stype=|:type=)/.test(source), rel)
})

console.log('status token mapping ok')
