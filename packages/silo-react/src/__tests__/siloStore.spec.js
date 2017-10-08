import expect from 'expect'
import { createSiloStore, applyMiddleware } from '../index'
import { addTestPath } from './utils'

describe('createSiloStore', () => {
  it('create check', () => {
    expect(() => createSiloStore(3)).toThrow(/must be an object/)
    const store = createSiloStore()
    expect(() => store.getState('unknown')).toThrow(/Unknown path/)
    expect(() => store.exec('sit:nown')).toThrow(/Unknown exec key /)
    addTestPath(store)
    expect(() => store.exec('set:test')).toThrow(/Unknown set/)
    expect(() => store.exec('set:test/abc')).toThrow(/Unknown set abc/)
  })
  it('create', () => {
    const store = createSiloStore()
    addTestPath(store)
    let times = 0
    store.subscribe(() => {
      times++
    })
    store.exec('set:test/noChange')
    expect(times).toBe(0)
    store.exec('set:test/change', 1)
    expect(times).toBe(1)
    expect(store.getState('test').count).toBe(1)
    store.exec('action:test/mulitiChange')
    expect(store.getState('test').count).toBe(8)
    expect(times).toBe(4)
    store.exec('reset:test', { count: 0 })
    expect(times).toBe(5)
    expect(store.getState('test').count).toBe(0)
  })
  it('applyMiddleware', () => {
    let times = 0
    /* eslint-disable */
    const middleware = s => next => action => {
      times++
      return next(action)
    }
    const store = applyMiddleware(middleware)(createSiloStore)()
    addTestPath(store)
    store.exec('set:test/noChange')
    store.exec('action:test/mulitiChange')
    store.exec('reset:test', { count: 0 })
    expect(times).toBe(5)
    const noChange = store.getPathMethods('test').setters.noChange
    noChange()
    expect(times).toBe(6)
  })
})
