import expect from 'expect'
import SiloSchema from '../SiloSchema'
import ArraySchema from '../builtins/Array'
import StringSchema from '../builtins/String'

async function check(fn, obj) {
  try {
    await fn()
  } catch (e) {
    expect(e.valid).toMatchObject(obj)
  }
}

describe('SiloSchema', () => {
  let schema = {}
  beforeEach(() => {
    schema = new SiloSchema()
  })
  it('create schema', () => {
    expect(() => schema.add({})).toThrow(/name required/)
    schema.add({
      name: 'String',
      validator: {
        max() {},
      },
      transformer: {
        trim() {},
      },
    })
    expect(() => schema.add({ name: 'String' })).toThrow(/conflicted/)
    expect(() => schema.add({
      name: 'Address',
      struct: {
        province: { type: 'unknown' },
      },
    })).toThrow(/"unknown" undefined/)
    expect(() => schema.add({
      name: 'Address',
      struct: {
        province: { type: 'String', unknown: 'unknown' },
      },
    })).toThrow(/"unknown" undefined/)
    const addressSchema = schema.add({
      name: 'Address',
      struct: {
        province: { type: 'String!' },
      },
    })
    expect(addressSchema.struct.province.required).toBe(true)
  })
  it('schema array', () => {
    schema.add(ArraySchema)
    schema.add({ name: 'String' })
    const addressSchema = schema.add({
      name: 'Address',
      struct: {
        city: { type: '[String]!' },
      },
    })
    expect(addressSchema.struct.city.type).toBe('Array')
    expect(addressSchema.struct.city.arrayType).toBe('String')
    expect(addressSchema.struct.city.required).toBe(true)
    expect(() => schema.add({
      name: 'Address2',
      struct: {
        province: { type: '[unknownType]' },
      },
    })).toThrow(/"unknownType" undefined/)
  })
  it('default validator', async () => {
    const strSchema = schema.add({
      name: 'String',
      validator: {
        default: val => typeof val === 'string',
      },
    })
    await check(() => strSchema.value(3), { validName: 'default' })
  })
  it('value', async () => {
    const strSchema = schema.add({
      name: 'String',
      validator: {
        max: (val, max) => val.length <= max.length,
      },
      transformer: {
        trim: val => val.trim(),
        defaultValue: (val, r) => (val === undefined ? r : val),
      },
    })
    expect(await strSchema.value(undefined, { defaultValue: 'default' })).toBe('default')
    expect(await strSchema.value(' trim  ')).toBe(' trim  ')
    expect(await strSchema.value(' trim  ', { trim: true })).toBe('trim')
    await check(() => strSchema.value('1234', { max: 3 }), { validName: 'max', ruleValue: 3, validValue: '1234', path: [] })
  })
  it('struct value', async () => {
    schema.add(StringSchema)
    const addr = schema.add({
      name: 'Address',
      validator: {
        noBeijing: obj => obj.city !== 'Beijing',
      },
      struct: {
        city: { type: 'String', required: true },
        province: { type: 'String', max: 3 },
      },
    })
    await check(() => addr.value({ province: 'Zhejiang' }), {
      validName: 'required',
      ruleValue: true,
      validValue: undefined,
      path: ['city'],
    })
    await check(() => addr.value({ city: 'hangzhou', province: 'Zhejiang' }), {
      validName: 'max',
      ruleValue: 3,
      validValue: 'Zhejiang',
      path: ['province'],
    })
    await check(() => addr.value({ city: 'Beijing' }, { noBeijing: true }), {
      validName: 'noBeijing',
      ruleValue: true,
      validValue: { city: 'Beijing', province: undefined },
      path: [],
    })
    const user = schema.add({
      name: 'User',
      struct: {
        address: { type: 'Address' },
      },
    })
    await check(() => user.value({ address: { province: 'Zhejiang' } }), {
      validName: 'required',
      ruleValue: true,
      validValue: undefined,
      path: ['address', 'city'],
    })
  })
  it('struct array value', async () => {
    schema.add(StringSchema)
    schema.add(ArraySchema)
    const addr = schema.add({
      name: 'Address',
      struct: {
        city: { type: '[String]', noEmpty: true },
      },
    })
    const user = schema.add({
      name: 'User',
      struct: {
        addrs: { type: '[Address]!' },
      },
    })
    await check(() => addr.value({ city: [] }), { validName: 'noEmpty' })
    await check(() => addr.value({ city: [3] }), { validName: 'default' })
    expect(await addr.value({ city: ['Beijing'] })).toEqual({ city: ['Beijing'] })
    const val = {
      addrs: [
        { city: [3] },
      ],
    }
    await check(() => user.value(val), { path: ['addrs', 0, 'city', 0] })
  })
  it('struct array item rule', async () => {
    schema.add(StringSchema)
    schema.add(ArraySchema)
    const addr = schema.add({
      name: 'Address',
      struct: {
        city: { type: '[String]', noEmpty: true, itemRule: { max: 3 } },
      },
    })
    await check(() => addr.value({ city: ['Beijing'] }), { validName: 'max' })
  })
})
