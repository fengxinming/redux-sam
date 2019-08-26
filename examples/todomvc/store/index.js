import { createStore, applyMiddleware } from 'redux';
import { reducer, middleware, Sam, createHelpers } from '../../redux-sam'
import { mutations, STORAGE_KEY } from './mutations'
import actions from './actions'
import plugins from './plugins'

const sam = new Sam({
  state: {
    todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  },
  actions,
  mutations,
  plugins
});

const { mapActions, mapMutations } = createHelpers(sam);

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export { store, sam, mapActions, mapMutations };
