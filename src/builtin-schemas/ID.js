export default {
  name: 'ID',
  validator: {
    default: val => typeof val === 'boolean',
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
