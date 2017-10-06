export default {
  name: 'Password',
  validator: {
    default: val => typeof val === 'string',
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
