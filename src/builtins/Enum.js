import Enums from '../common/Enums'

export default {
  name: 'Enum',
  validator: {
    default: val => typeof val === 'number',
    enums: (v, enums) => enums instanceof Enums,
  },
  transformer: {
    defaultNow: () => Date.now(),
  },
}
