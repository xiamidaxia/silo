import SiloSchema from './SiloSchema'

export default class SiloStore {
  constructor(builtinSchemas) {
    this.store = {}
    this.schema = new SiloSchema()
    this.addSchema(...builtinSchemas)
  }
  save() {
  }
  check() {
  }
  findById() {
  }
  onChange() {
  }
  normalize() {
  }
  addSchema(...schemas) {
    const schema = this.schema
    schemas.forEach(data => schema.add(data))
  }
}
