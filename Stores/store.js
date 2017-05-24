import { applyMiddleware, createStore } from 'redux';
import reducer from '../Reducers';
import thunk from 'redux-thunk';


var store = applyMiddleware(thunk)(createStore)(reducer);
console.log("store is:");
console.log(store.getState())
export default store;
