import applyMiddleware from 'redux/lib/applyMiddleware'
import compose from 'redux/lib/compose'
import createSiloStore from './createSiloStore'
import createStore from './createStore'
import connect from './connect'
import Provider from './Provider'

export {
  createSiloStore,
  createStore,
  applyMiddleware,
  compose,
  connect,
  Provider,
}
