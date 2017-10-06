export default {
  name: 'Number',
  validator: {
    default: val => typeof val === 'number',
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
