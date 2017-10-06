
export default {
  name: 'Array',
  validator: {
    default: val => Array.isArray(val),
    range() {
    },
    match(val, rule) {
      return rule.test(val)
    },
    max(val, max) {
      return val.length <= max
    },
    min(val, min) {
      return val.length >= min
    },
    noEmpty(val) {
      return val.length !== 0
    },
    arrayType() {
      return true // no check
    },
    itemRule(val) {
      return typeof val === 'object'
    },
  },
  transformer: {
  },
}
