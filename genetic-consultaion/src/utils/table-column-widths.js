function validWidth (value) {
  const width = parseInt(value, 10)
  return Number.isFinite(width) && width >= 40 ? width : null
}

export function readColumnWidths (storage, key, defaults) {
  const base = Object.assign({}, defaults || {})
  if (!storage || !key) return base
  try {
    const saved = JSON.parse(storage.getItem(key) || '{}')
    Object.keys(base).forEach(prop => {
      const width = validWidth(saved[prop])
      if (width) base[prop] = width
    })
  } catch (e) {}
  return base
}

export function saveColumnWidth (storage, key, widths, prop, width, defaults) {
  if (!defaults || defaults[prop] === undefined) return widths
  const nextWidth = validWidth(width)
  if (!nextWidth) return widths
  const next = Object.assign({}, defaults, widths || {}, { [prop]: nextWidth })
  if (storage && key) {
    try {
      storage.setItem(key, JSON.stringify(next))
    } catch (e) {}
  }
  return next
}
