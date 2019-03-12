import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
export { default as firebase } from './firebase';
export { default as history } from './history';
