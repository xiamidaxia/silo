export default {
  name: 'Date',
  validator: {
    default: val => typeof val === 'boolean',
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
