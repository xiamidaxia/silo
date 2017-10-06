export default {
  name: 'String',
  validator: {
    default: val => typeof val === 'string',
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
  },
  transformer: {
    uppercase: val => val.toUpperCase(),
    lowercase: val => val.toLowerCase(),
    trim: val => val.trim(),
  },
}
