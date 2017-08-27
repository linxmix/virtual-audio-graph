export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)
export const equals = (a, b) => {
  if (a === b) return true
  const typeA = typeof a
  if (typeA !== typeof b || typeA !== 'object') return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false
    return true
  }
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  if (keysA.length > 1000) return false
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!equals(a[key], b[key])) return false
  }
  return true
}
export const forEach = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i]) }
export const filter = (f, xs) => {
  const ys = []
  for (let i = 0; i < xs.length; i++) f(xs[i]) && ys.push(xs[i])
  return ys
}
export const find = (f, xs) => { for (let i = 0; i < xs.length; i++) if (f(xs[i])) return xs[i] }
export const mapObj = (f, o) => {
  const p = {}
  for (const key in o) if (Object.prototype.hasOwnProperty.call(o, key)) p[key] = f(o[key])
  return p
}
export const values = obj => {
  const keys = Object.keys(obj)
  const ret = []
  for (let i = 0; i < keys.length; i++) ret[i] = obj[keys[i]]
  return ret
}

export const get = (object, keys, defaultVal) => {
  keys = Array.isArray(keys) ? keys : keys.split('.')
  object = object[keys[0]]
  if (object && keys.length > 1) {
    return get(object, keys.slice(1), defaultVal)
  }
  return object === undefined ? defaultVal : object
}

export const set = (object, keys, val) => {
  keys = Array.isArray(keys) ? keys : keys.split('.')
  if (keys.length > 1) {
    object[keys[0]] = object[keys[0]] || {}
    return set(object[keys[0]], keys.slice(1), val)
  }
  object[keys[0]] = val
}
