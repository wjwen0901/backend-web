// TODO(待联调通过后撤除): 知情列表后端 selectAllAndUser 已在 prUpdate
// 分支去除 informed_consent_file / product_group_relat 的 1:N join
// （见 mdhcare-backend/docs/sql-change-20260511-informed-list-dedup.md）。
// 该兜底仅用于联调验收期间防御后端尚未发布前端先发的情况，QA 真机
// 验证（前后页 id 不重叠 + total 与 count(distinct i.id) 一致）通过后
// 需要删除此函数及其调用点。
export function limitPageRows (rows, pageSize) {
  const list = Array.isArray(rows) ? rows : []
  const size = parseInt(pageSize, 10)
  if (!Number.isFinite(size) || size <= 0) return list
  return list.length > size ? list.slice(0, size) : list
}
