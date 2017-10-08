export default {
  name: 'Number',
  validator: {
    default: val => typeof val === 'number',
    max(val, max) {
      return val <= max
    },
    min(val, min) {
      return val >= min
    },
  },
  transformer: {
  },
}
