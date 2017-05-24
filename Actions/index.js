import Constants from '../Constants/Constants.js';
var AjaxHelper = require('../Helper/AjaxHelper');
import {browserHistory} from 'react-router';

console.log("in action");

export function getInitialProducts(object) {
	console.log('get initialo product');
	return (dispatch) => {
		var data = AjaxHelper.getData('/getInitialProducts',object);
		dispatch({type:Constants.GET_INITIAL_PRODUCTS,data:data})
	}
}

export function searchProducts(searchString){
	console.log('searching products');
	return (dispatch) => {
		let data = AjaxHelper.searchProducts('/searchProducts',{searchString:searchString});

		dispatch({type:Constants.SEARCH_PRODUCTS,data:data});
		browserHistory.push('/search');
	}
}


export function searchProductsByCategory(category){
	console.log('getting by category');
	return (dispatch) => {
		let data = AjaxHelper.searchProductsByCategory('/searchByCategory',{category:category});
		dispatch({type:Constants.PRODUCT_CATEGORY,data:data});
		browserHistory.push('/category');
	}
}


export function onSignUp(new_user){
	console.log('signing up:' + new_user);
	return (dispatch) => {
		let data = AjaxHelper.signUp('/signingUp',new_user);
		if(data != false){
			dispatch({type:Constants.SIGNUP,data:new_user});
			browserHistory.push('/login');
		}else{
			console.log("signingUp unsuccessful")
			browserHistory.push('/signup');
		}
	}
}


export function onHandleLogIn(user){
	console.log('Login from Actions by: ' + user);
	return (dispatch) => {
		let data = AjaxHelper.login('/logingIn',user);
		if(data != false){
				console.log("login in check data validation: "+data);
				let y = localStorage.getItem("cart").length;
				let x;
				if (y!=0)
					x = JSON.parse(localStorage.getItem("cart"))
				else
					x = null
				console.log("localStorage.getItem : "+x)
				if(x!=null && x.length > 0){
					for (let k=0;k<x.length;k++)
						data.cart.push(x[k]);
					localStorage.setItem("cart",'')
				}
				dispatch({type:Constants.LOGIN,data:data});
				browserHistory.push('/');
			}else{
				console.log("Action login failed..")
				alert("Invalid credentials");
				browserHistory.push('/login');
			}
	}
}


export function addToCart(data){
	console.log('Add to Cart of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.addToCart('/addToCart',data);
			console.log("add to cart validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.ADD_TO_CART,data:data});

	}
}

export function addToWishList(data){
	console.log('Add to WishList of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.addToWishList('/addToWishList',data);
			console.log("add to WishList validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.ADD_TO_WISHLIST,data:data});

	}
}

export function onFeedback(object){
	console.log('submitting feedback');
	console.log(object);
	return (dispatch) => {
		let data = AjaxHelper.submitFeedback('/submitFeedback',object);
		console.log(data);
		dispatch({type:Constants.SUBMIT_FEEDBACK,data:object});
	}
}

export function logOut(){
	console.log('logout in actions');
	return (dispatch) => {
		dispatch({type:Constants.LOGOUT});
		browserHistory.push('/');
	}
}

export function getAllProducts(object) {
	console.log('get all product');
	var data = AjaxHelper.getAllProducts('/getAllProducts',object);
	return data;

}



export function getDailyDeal(object){
	console.log('getting daily deals');
	return (dispatch) => {
		let data = AjaxHelper.getDailyDeals('/dailyDeal',object);
		dispatch({type:Constants.GET_DAILY_DEAL,data:data});
		browserHistory.push('/deal');
	}


}

export function removeFromCart(data){
	console.log('Remove from Cart of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.addToCart('/removeFromCart',data);
			console.log("remove from cart validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.REMOVE_FROM_CART,data:data});

	}
}
export function increaseQty(data){
	console.log('Increase quantity in Cart of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.increaseQty('/increaseQty',data);
			console.log("increase item in cart validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.INCREASE_QTY,data:data});

	}
}
export function decreaseQty(data){
	console.log('Decrease quantity in Cart of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.increaseQty('/decreaseQty',data);
			console.log("decrease item in cart validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.DECREASE_QTY,data:data});

	}
}

export function onHandleDetailsUpdate(updated_user){
	console.log('User Details update:11 ' + JSON.stringify(updated_user));
	return (dispatch) => {
		//if (updated_user.username != 'guest'){
		console.log("sd")
			let data = AjaxHelper.personalDetails('/personalDetails',updated_user);
			console.log("update user details response: "+JSON.stringify(data) );
			dispatch({type:Constants.UPDATE_USER,data:data});
			//browserHistory.push('/mydetails');
		//}
	}
}

export function removeFromWishList(data){
	console.log('Remove from wishlist of user: ' + data.username+' product '+data.pdtId);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.removeFromWishList('/removeFromWishList',data);
			console.log("remove from wishlist validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.REMOVE_FROM_WISHLIST,data:data});

	}
}


export function cancelOrder(data){
	console.log('Cancel order of user: ' + data.username+' product '+data.order_id);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.cancelOrder('/cancelOrder',data);
			console.log("cancel order validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.CANCEL_ORDER,data:data});


	}
}

export function returnOrder(data){
	console.log('Return order of user: ' + data.username+' product '+data.order_id);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.returnOrder('/returnOrder',data);
			console.log("cancel order validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.RETURN_ORDER,data:data});


	}
}

export function buy(data){
	console.log('buy of user: ' + data.username+' product '+data.order_history);
	return (dispatch) => {
		if (data.username != 'guest'){
			let ret_data = AjaxHelper.buy('/buy',data);
			console.log("buy validation: "+JSON.stringify(ret_data) );
		}
		dispatch({type:Constants.BUY,data:data});
		browserHistory.push('/orders');

	}
}
