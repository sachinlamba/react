var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var _collection = require('lodash/collection'); // find
var _util = require('lodash/util'); // matches
var Product = require('./Schema/ProductSchema.js');
var User = require('./Schema/UserSchema.js');
var app = express();
require('./database.js');
// Hot reloading
var compiler = webpack(webpackConfig);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(webpackDevMiddleware(compiler, {
	noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
// End hot reloading

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var server = app.listen(3000);

app.post('/getInitialProducts',function(req,res){
	console.log('in req');
	Product.find({}).limit(10).exec(function(err,product){
		//console.log(product);
		res.send(product);
	});
});

app.post('/signingUp',function(req,res){
	console.log(req.body);
	console.log('in signingup');
	/*
	User.find({}).limit(10).exec(function(err,result){
		console.log(result);
		res.send(result);
	});*/
	console.log("insert now" + req.body._id);
	let add_user = new User({
		"username":req.body.username,
		"_id":req.body._id,
		"mobile_no":req.body.mobile_no,
		"password":req.body.password
	});
	add_user.save( function(err,result){
		if(err){
			console.log("error occured : " + err)
		}
		console.log("successful signup"+result)
		User.findOne({"_id":req.body._id}).exec(function(err,user){
			if(user != null){
				res.send(user);
			}else{
				res.send(false);
			}
		});
	});
});
console.log('Server running at http://localhost:3000');


app.post('/searchProducts',function(req,res){

	console.log('searching products');
	console.log(req.body.searchString);
	let x = '^'+req.body.searchString+''
	console.log(x);
	Product.find({'name':{$regex: new RegExp(req.body.searchString,'im')}},function(err,data){
		console.log(data);
		res.send(data);
	})
});


app.post('/searchByCategory',function(req,res){
	console.log('searching by category');
	console.log(req.body.category);
	Product.find({'category':req.body.category},function(err,data){
		if(err){
			console.log("error in login:"+err);
		}
		console.log(data);
		res.send(data);
	});
});



app.post('/logingIn',function(req,res){
	console.log(req.body);
	console.log('in logingIn emailid: ' + req.body.emailid);
	User.findOne({"_id":req.body.emailid,"password":req.body.password}).exec(function(err,result){
		if(err){
			console.log("unsuccessful login")
			res.send(false)
		}else{
			console.log("valid user details: " + result);
			res.send(result);
		}
	});
});


app.post('/addToCart',function(req,res){
	console.log(req.body);
	console.log('in add to cart user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let new_cart=result.cart;
			let flag=false;
			for (let i=0; i<new_cart.length;i++){
				if(new_cart[i].product == req.body.pdtId){
					let qty = parseInt(new_cart[i].quantity) + 1;
					if (qty>4){
						qty=4;
					}
					new_cart[i].quantity = qty.toString();
					flag=true;
					break;
				}
			}
			if (flag==false){
				console.log('flag is false..');
				new_cart.push({
							  product: req.body.pdtId,
							  quantity: "1"
							});
			}
			else{
				console.log('flag is true..')
			}
			User.update({"username":req.body.username} , {$set:{"cart":new_cart}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/addToWishList',function(req,res){
	console.log(req.body);
	console.log('in add to wishlist user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let new_wishlist=result.wishlist;
			let flag=false;
			for (let i=0; i<new_wishlist.length;i++){
				if(new_wishlist[i].product== req.body.pdtId){
					let qty = parseInt(new_wishlist[i].quantity) + 1;
					if (qty>4){
						qty=4;
					}
					new_wishlist[i].quantity = qty.toString();
					flag=true;
					break;
				}
			}
			if (flag==false){
				new_wishlist.push({
							  product: req.body.pdtId,
							  quantity: "1"
							});
			}
			User.update({"username":req.body.username} , {$set:{"wishlist":new_wishlist}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});


app.post('/submitFeedback',function(req,res){
	console.log('submitting feedback');
	console.log(req.body);
	Product.findOne({"_id":req.body.pdtId},function(err,data){
		console.log(data);

		let feedbacks = data.feedback;
		feedbacks.push({
			rating:req.body.rating,
			comment:req.body.comment,
			user_name:req.body.user_name,
			added_date:Date.now()

		})
		Product.update({"_id":req.body.pdtId},{$set:{"feedback":feedbacks}},function(err,upd){
			console.log(err);
			console.log(upd);
			res.send(upd);
		});


	});
});


app.post('/pushNotifications',function(req,res){
	User.findOne({"_id":req.body._id},function(err,data){
		let notifications = data.notifications;
		notifications.push(req.body.notification);
		User.update({"_id":req.body._id},{$set:{"notification":notifications}},function(err,upd){
			console.log(err);
			console.log(upd);
			res.send(upd);
		});
	});
});

app.post('/getNotifications',function(req,res){
	Users.findOne({"_id":req.body._id},function(err,data){
		if (err){
			res.send(err);
		}else{
			res.send(data.notification);
		}
	});
});
app.post('/getAllProducts',function(req,res){
	console.log('in req');
	var ret_products=[]
	Product.find({}).exec(function(err,product){
		console.log("GETTING ALL PRODUCTS..........");
		console.log(product);
		for (var i=0;i<product.length;i++){
			for (var j=0 ; j<req.body.cart.length ; j++){
				if (product[i]._id == req.body.cart[j].product){
					ret_products.push(product[i]);
				}
			}
		}
		res.send(ret_products);

	});
});


app.post('/removeFromCart',function(req,res){
	console.log(req.body);
	console.log('in remove cart user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let old_cart=result.cart;

			let new_cart = [];
			for (let i=0; i<old_cart.length;i++){
				if(old_cart[i].product!= req.body.pdtId){
					new_cart.push(old_cart[i])
				}
			}
			User.update({"username":req.body.username} , {$set:{"cart":new_cart}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/dailyDeal',function(req,res){
	Product.find({"isDeal":true},function(err,data){
		console.log(data);
		res.send(data);
	});
});

app.post('/increaseQty',function(req,res){
	console.log(req.body);
	console.log('in server for increase qty cart user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let new_cart=result.cart;
			for (let i=0; i<new_cart.length;i++){
				if(new_cart[i].product== req.body.pdtId){
					let qty = parseInt(new_cart[i].quantity) + 1;
					if (qty>4){
						qty=4;
					}
					new_cart[i].quantity = qty.toString();

					break;
				}
			}

			User.update({"username":req.body.username} , {$set:{"cart":new_cart}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/decreaseQty',function(req,res){
	console.log(req.body);
	console.log('in server for decrease qty cart user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let new_cart=result.cart;
			for (let i=0; i<new_cart.length;i++){
				if(new_cart[i].product== req.body.pdtId){
					let qty = parseInt(new_cart[i].quantity) - 1;
					if (qty==0){
						qty=1;
					}
					new_cart[i].quantity = qty.toString();

					break;
				}
			}

			User.update({"username":req.body.username} , {$set:{"cart":new_cart}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});
app.post('/personalDetails',function(req,res){
	console.log("in personalDetails :"+JSON.stringify(req.body))
	User.update({"_id":req.body._id} , {$set:req.body}, function(err,upd){
		if(err){
			console.log("Error while updating details "+err);
		}
		else{
			res.send(upd);
		}
	});

});

app.post('/removeFromWishList',function(req,res){
	console.log(req.body);
	console.log('in remove cart user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let old_wishlist=result.wishlist;

			let new_wishlist = [];
			for (let i=0; i<old_wishlist.length;i++){
				if(old_wishlist[i].product!= req.body.pdtId){
					new_wishlist.push(old_wishlist[i])
				}
			}
			User.update({"username":req.body.username} , {$set:{"wishlist":new_wishlist}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/cancelOrder',function(req,res){
	console.log(req.body);
	console.log('in cancel order user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let order_history=result.order_history;

			for (let i=0; i<order_history.length;i++){
				if(order_history[i].order_id == req.body.order_id){
					order_history[i].order_status = "Cancelled";
					break;
				}
			}
			User.update({"username":req.body.username} , {$set:{"order_history":order_history}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/returnOrder',function(req,res){
	console.log(req.body);
	console.log('in cancel order user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let order_history=result.order_history;

			for (let i=0; i<order_history.length;i++){
				if(order_history[i].order_id == req.body.order_id){
					order_history[i].order_status = "Return requested";
					break;
				}
			}
			User.update({"username":req.body.username} , {$set:{"order_history":order_history}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

app.post('/buy',function(req,res){
	console.log(req.body);
	console.log('in buy order user: ' + req.body.username);
	User.findOne({"username":req.body.username}).exec(function(err,result){
		if(err){
			console.log('Error occurred '+err);
		}
		else{
			console.log("valid user details: " + result);
			let order_history=result.order_history;

			order_history.push(req.body.order_history);
			
			User.update({"username":req.body.username} , {$set:{"order_history":order_history,cart:[]}}, function(err,upd){
				if(err){
					console.log("Error while updating "+err);
				}
				else{
					res.send(upd);
				}
			});
		}

	});
});

console.log('Server running at http://localhost:3000');
