import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from '~/redux-sam';
import home from './store/modules/home';
import login from './store/modules/login';

const sam = new Sam({
  modules: {
    home,
    login
  }
});

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export default store;
