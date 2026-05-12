function pathOfTabKey (key) {
  return (key || '').split('?')[0] || '/'
}

export function isCacheableTabKey (key) {
  const path = pathOfTabKey(key)
  return /\/(edit|add)(\/|$)/.test(path) || path.indexOf('/review/detail/') === 0
}

export function cacheKeyForTab (key, versions) {
  return key + '::' + ((versions && versions[key]) || 0)
}

export function bumpCacheVersion (versions, key) {
  const next = Object.assign({}, versions || {})
  if (isCacheableTabKey(key)) next[key] = (next[key] || 0) + 1
  return next
}

export function bumpCacheVersions (versions, keys) {
  return (keys || []).reduce((next, key) => bumpCacheVersion(next, key), versions || {})
}

export function closeTabByKey (tabs, key, target) {
  const nextTabs = Array.isArray(tabs) ? tabs.slice() : []
  const idx = nextTabs.findIndex(item => item.key === key)
  if (idx !== -1) nextTabs.splice(idx, 1)
  const fallback = (nextTabs[idx] || nextTabs[idx - 1] || nextTabs[0] || {}).key
  return {
    tabs: nextTabs,
    target: target || fallback || '/dashboard'
  }
}

export function closeCurrentTab (vm, target) {
  if (!vm || !vm.$root) return
  vm.$root.$emit('pc-close-tab', {
    key: vm.$route.fullPath,
    target
  })
}
