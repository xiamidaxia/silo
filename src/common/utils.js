const objKeys = Object.keys

export const reduce = (obj = {}, fn, origin) => objKeys(obj).reduce((res, key) => fn(res, obj[key], key), origin)

export const mapValues = (obj, fn) => reduce(obj, (res, val, key) => Object.assign(res, { [key]: fn(val, key) }), {})

export const map = (obj, fn) => reduce(obj, (res, val, key) => fn(val, key), {})

export const filter = (obj, fn) => reduce(obj, (res, val, key) => (fn(val, key) ? Object.assign(res, { [key]: val }) : res), {})

export const pick = (obj, keys = []) => filter(obj, (val, key) => keys.indexOf(key) !== -1)

export const shouldRequiredKeys = (msg, keys) => (val = {}) => keys.forEach((key) => {
  if (val[key] === undefined) throw new Error(`${msg} "${key}" required!`)
})

export const shouldSupportKeys = (msg, keys) => (val = {}) => map(val, (o, key) => {
  if (keys.indexOf(key) === -1) throw new Error(`${msg} "${key}" undefined!`)
})

export const promiseObject = async (obj, fn) => {
  const keys = objKeys(obj)
  const arr = await Promise.all(reduce(obj, (res, o, k) => res.concat(fn(o, k)), []))
  return keys.reduce((res, key, index) => Object.assign(res, { [key]: arr[index] }), {})
}

export const promiseReduce = async (obj, fn, res) => {
  const keys = Object.keys(obj).reverse()
  let key
  /* eslint-disable */
  while (key = keys.pop()) {
    res = await fn(res, obj[key], key)
  }
  /* eslint-enable */
  return res
}
