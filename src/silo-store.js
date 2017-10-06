import schemaManager from './silo-schema'

export default class SiloStore {
  constructor() {
    this.doc = []
    Object.assign(this, schemaManager())
  }
  saveData() {
  }
  findById() {
  }
  onChange() {
  }
}
