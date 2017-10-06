export default {
  name: 'Enum',
  validator: {
    default: val => typeof val === 'boolean',
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
