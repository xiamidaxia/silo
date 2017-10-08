const OriginEnums = require('enums')

export default class Enums extends OriginEnums {
  constructor(items, methods) {
    const enums = items.map((item, index) => {
      // add default code
      if (item.code === undefined) {
        item.code = index
      }
      return item
    })
    super(enums)
    Object.assign(this, methods || {})
  }
  /**
   * @param {...string} keys
   * @returns {[number]}
   * @example
   *    storeStateEnums.codes() // [0, 1, 2, 3]
   *    storeStateEnums.codes('TEMP', 'PUBLISH') // [0, 3]
   */
  codes(...keys) {
    if (keys.length === 0) {
      return this.enums.map(item => item.code)
    }
    return keys.map(key => this[key].code)
  }
  filter(cb) {
    return this.enums.filter(cb)
  }
  map(fn) {
    return this.enums.map(fn)
  }
  eql(name, code) {
    const enumCache = this.getByCode(code)
    return enumCache ? enumCache.name === name : false
  }
  getByCode(code) {
    return this.getBy('code', Number(code))
  }
  getByCodes(...codes) {
    return codes.map(code => this.getByCode(code))
  }
}
