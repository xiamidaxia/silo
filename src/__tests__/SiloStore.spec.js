import SiloStore from '../SiloStore'
import builtins from '../builtins'

describe('SiloStore', () => {
  let silo
  beforeEach(() => {
    silo = new SiloStore(builtins)
  })
  it('create', () => {
    // AddressSchema
    silo.addSchema({
      name: 'Address',
      struct: {
        id: { type: 'ID!' },
        province: { type: 'String!', defaultValue: 'Beijing' },
        city: { type: 'String!', defaultValue: 'Beijing' },
      },
    })

    // UserSchema
    silo.addSchema({
      name: 'User',
      struct: {
        id: { type: 'ID!' },
        name: { type: 'String!', max: 10 },
        addrs: { type: '[Address]' },
        age: { type: 'Number' },
      },
    })


    silo.save('User', {
      id: '123132',
      name: 'silo',
      age: 20,
      addrs: [
        { id: '1231', province: 'Fujian', city: 'Quanzhou' },
        { id: '33', province: 'Zhejiang', city: 'Hangzhou' },
      ],
    })
  })
})
