
# Silo

## Quick Start

```js
import SiloStore from 'silojs/lib/SiloStore'
import builtinSchemas from 'silojs/lib/builtins'

const siloStore = new SiloStore(builtinSchemas)

// AddressSchema
siloStore.addSchema({
  name: 'Address',
  struct: {
    province: { type: 'String!', defaultValue: 'Zhejiang' },
    city: { type: 'String!', defaultValue: 'Hangzhou' }
  }
})

// UserSchema
siloStore.addSchema({
  name: 'User',
  struct: {
    id: { type: 'ID!' },
    name: { type: 'String!', max: 10 },
    addrs: { type: '[Address]' },
    age: { type: 'Number' },
  }
})


siloStore.save('User', {
  id: '123132',
  name: 'silo',
  age: 20,
  addrs: [
    { province: 'Fujian', city: 'Quanzhou' },
    { type: 'String!', defaultValue: 'Hangzhou' },
  ]
}).catch(e => console.log(e))

```

