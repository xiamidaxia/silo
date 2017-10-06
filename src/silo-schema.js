import { mapValues, filter, shouldSupportKeys, reduce, promiseObject, promiseReduce } from './common/utils'
import { defaultErrorMessages } from './common/constants'

function defaultError(valid) {
  let msg = defaultErrorMessages[valid.validName] || 'valid error'
  msg = reduce(valid, (res, val, key) => res.replace(`{{${key}}}`, val), msg)
  const error = new Error(msg)
  error.valid = valid
  return error
}

function normalizeType(typeString) {
  let required = false
  let arrayType
  if (typeString.slice(-1) === '!') {
    required = true
    typeString = typeString.slice(0, -1)
  }
  if (typeString[0] === '[' && typeString.slice(-1) === ']') {
    arrayType = typeString.slice(1, -1)
    typeString = 'Array'
    return { required, type: typeString, arrayType }
  }
  return { required, type: typeString }
}

export default function schemaManager() {
  const schemas = {}
  function addSchema({ name, validator = {}, struct = {}, transformer = {}, error = defaultError }) {
    if (!name) throw new Error('Schema name required!')
    if (schemas[name]) throw new Error(`Schema ${name} conflicted!`)
    validator = {
      required: (val, isRequired) => (isRequired ? val : true),
      ...validator,
    }
    transformer = {
      default: (val, r) => (val === undefined ? r : val),
      ...transformer,
    }
    const currentSchema = {
      name,
      validator,
      transformer,
      error,
      supportKeys: Object.keys(validator).concat(Object.keys(transformer), 'type'),
    }
    // Normalize struct
    currentSchema.struct = mapValues(struct, (obj, key) => {
      const { required, ...others } = normalizeType(obj.type)
      obj = { ...obj, ...others, required: required || obj.required }
      if (!schemas[obj.type]) throw new Error(`Schema type "${obj.type}" undefined`)
      if (obj.arrayType && !schemas[obj.arrayType]) throw new Error(`Schema array type "${obj.arrayType}" undefined`)
      const currentSupportKeys = schemas[obj.type].supportKeys
      shouldSupportKeys(`Schema ${name} struct ${key} key`, currentSupportKeys)(obj)
      return obj
    })
    const noDefaultTransformer = filter(transformer, (val, key) => key !== 'default')
    const noDefaultAndRequiredValidator = filter(validator, (val, key) => key !== 'required' && key !== 'default')
    const valueOf = async (val, rule = {}, path) => {
      const tryValid = async (validName, fn, value, blocker) => {
        if (blocker) {
          if (blocker(value, rule[validName])) return
        } else if (value === undefined || rule[validName] === undefined) return
        if (!await fn(value, rule[validName], schemas)) {
          throw currentSchema.error({
            validName,
            ruleValue: rule[validName],
            validValue: value,
            path,
          })
        }
      }
      val = await transformer.default(val, rule.default, schemas)
      // transformer
      val = await promiseReduce(noDefaultTransformer, (res, fn, key) => {
        if (rule[key] !== undefined) return fn(res, rule[key], schemas)
        return res
      }, val)
      // validator
      await tryValid('required', validator.required, val, (value, validValue) => validValue === undefined)
      if (validator.default) await tryValid('default', validator.default, val, value => value === undefined)
      await promiseObject(noDefaultAndRequiredValidator, (obj, key) => tryValid(key, obj, val))
      return val
    }
    currentSchema.value = async (originValue, rule, path = []) => {
      let val = originValue
      if (val === undefined) return valueOf(val, rule, path)
      if (currentSchema.name === 'Array') {
        if (!Array.isArray(originValue)) return valueOf(val, rule, path)
        val = await Promise.all(val.map((item, index) => (
          schemas[rule.arrayType].value(item, rule.itemRule || {}, path.concat(index))
        )))
      } else if (Object.keys(currentSchema.struct).length !== 0) {
        val = await promiseObject(currentSchema.struct, (obj, key) => (
          schemas[obj.type].value(val[key], obj, path.concat(key))
        ))
      }
      return valueOf(val, rule, path)
    }
    schemas[name] = currentSchema
    return currentSchema
  }
  return {
    schemas,
    addSchema,
  }
}
