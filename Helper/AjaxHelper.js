var $=require('jquery');

function PostRequest(url,data){
  var data;
  $.ajax({
    url:url,
    type:'POST',
    data:data,
    async:false,
    success:function(retObj){
      data=retObj;
    },
    error:function(err){
      data=err;
    }
  });
  return data;
}

module.exports={
  login:PostRequest,
  fetchItems:PostRequest,
  pdtDetails:PostRequest,
  submitFeedback:PostRequest,
  fetchAdminNotifications:PostRequest,
  discontinueProd:PostRequest,
  logout:PostRequest,
  getData:PostRequest,
  searchProducts:PostRequest,
  searchProductsByCategory:PostRequest,
  signUp:PostRequest,
  logingIn:PostRequest,
  addToCart:PostRequest,
  addToWishList:PostRequest,
  getAllProducts:PostRequest,
  logingOut:PostRequest,
  removeFromCart:PostRequest,
  getDailyDeals:PostRequest,
  increaseQty:PostRequest,
  decreaseQty:PostRequest,
  personalDetails:PostRequest,
  removeFromWishList:PostRequest,
  cancelOrder:PostRequest,
  returnOrder:PostRequest,
  buy:PostRequest
}
