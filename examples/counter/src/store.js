import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from './redux-sam';
import model from './models';

const sam = new Sam(model);

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export { store, sam };
