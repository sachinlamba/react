import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
//import Address from './components/Address';
import MyDetails from './components/MyDetails';
import ProductList from './components/ProductList';
import ProductDetail from './Components/ProductDetail';

import Notification from './Components/Notification';

import Cart from './Components/Cart';
import DailyDeal from './Components/DailyDeal';
import WishList from './Components/WishList';
import Orders from './Components/Orders';;
import Checkout from './Components/Checkout';

//import ProductList from './components/ProductList';
import store from './Stores/store.js';
import { Provider } from 'react-redux';

console.log('in app-client');
console.log(store.getState());
const routes = (
	<Provider store={store} >
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route component={Login} path="/login"/>
				<Route component={SignUp} path="/signup"/>
				<Route component={MyDetails} path="/mydetails"/>
				<Route component={ProductDetail} path='/productDetail/:pid' />
				<Route component={ProductList} path='/search' />
				<Route component={ProductList} path='/category' />

				<Route component={Notification} path='/notification' />

				<Route component={Cart} path='/cart' />
				<Route component={DailyDeal} path='/dailyDeal' />
				<Route component={ProductList} path='/deal' />
				<Route component={WishList} path='/wishlist' />
				<Route component={Orders} path='/orders' />
				<Route component={Checkout} path='/checkout' />
			</Route>
		</Router>
		</Provider>
	);

render(routes, document.getElementById('react-container'));
