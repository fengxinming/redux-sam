import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from '../redux-sam';
import createSamLogger from '~/redux-sam/logger';
import home from './modules/home';
import login from './modules/login';

const sam = new Sam({
  modules: {
    home,
    login
  },
  plugins: [process.env.NODE_ENV === 'development' && createSamLogger()]
});

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export { store, sam };
