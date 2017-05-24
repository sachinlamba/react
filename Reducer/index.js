import { combineReducers } from 'redux';
import ProductReducer from './ProductReducer';

import UserReducer from './UserReducer.js';




console.log("in index.js reducer");
const reducer = combineReducers({

  

  ProductReducer,
  UserReducer

});

export default reducer;
