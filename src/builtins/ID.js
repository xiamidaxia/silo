import { ObjectID } from 'bson'

export default {
  name: 'ID',
  validator: {
    default: val => ObjectID.isValid(val),
  },
  transformer: {
  },
}
