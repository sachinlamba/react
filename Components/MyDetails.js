import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import Address from './Address';
import Card from './Card';
import {onHandleDetailsUpdate} from '../Actions/index';

const mapStateToProps= (state) => {
  console.log("state in login component is:"+JSON.stringify(state));
  return {
    state:state.UserReducer
  }
}

const mapDispatchToProps= (dispatch) =>{
  return {
    onDetailsUpdate : (updated_user) =>{
      console.log("dispatch to update details")
      dispatch(onHandleDetailsUpdate(updated_user));
    }
    }
}



console.log("in MyDetails.jsx");
class MyDetails extends React.Component{
  constructor(props){
    super(props);
    this.addressFormShow = false;
    this.cardFormShow = false;
    this.personal_details_error = false;
    this.personal_details_msg = "hello";
    this.addAddress=this.addAddress.bind(this);
    this.addCard=this.addCard.bind(this);
    this.updateAddress=this.updateAddress.bind(this);
    this.removeAddress=this.removeAddress.bind(this);
    this.updateCard=this.updateCard.bind(this);
    this.removeCard=this.removeCard.bind(this);
    this.detailsAllowWrite=this.detailsAllowWrite.bind(this);
    this.detailsUpdate=this.detailsUpdate.bind(this);

  }
  addressHide() {
    document.getElementById('addressFormShow').style.display='none'
    document.getElementById('addressShow').style.display='block'
  };
  addressShow() {
    document.getElementById('addressFormShow').style.display='block'
    document.getElementById('addressShow').style.display='none'
  }

  cardHide() {
    document.getElementById('cardFormShow').style.display='none'
    document.getElementById('cardShow').style.display='block'
  };
  cardShow() {
    document.getElementById('cardFormShow').style.display='block'
    document.getElementById('cardShow').style.display='none'
  }

  detailsAllowWrite(){
    document.getElementById('detailsUpdateDiv').style.display='block';
    document.getElementById('detailsAllowWriteShow').style.display='none';
    document.getElementById('mobile').readOnly = false;
    document.getElementById('name').readOnly = false;
    document.getElementById('password').readOnly = false;
    document.getElementById('re_password').readOnly = false;

  }
  removeAddress(e){
    var data=JSON.parse(e.target.value);
    console.log("data :" + data);

    var current_user = this.props.state
    console.log("user " + current_user);
    var addresses = []
    current_user.address.map((add)=>{
      console.log(add)
      if(add._id != data._id && add.line1 != data.line1){
        addresses.push(add);
      }
    })
    console.log("address"+JSON.stringify(addresses))
    console.log("new" + current_user);
    this.props.state.address = addresses
    console.log("call Address to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)
  }
  removeCard(e){
    var data=JSON.parse(e.target.value);
    console.log("data :" + data);

    var current_user = this.props.state
    console.log("user " + current_user);
    var cards = []
    current_user.card_details.map((card)=>{
      console.log(card)
      if(card._id != data._id && card.card_number != data.card_number){
        cards.push(card);
      }
    })
    console.log("card"+JSON.stringify(cards))
    console.log("new" + current_user);
    this.props.state.card_details = cards
    console.log("call Address to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)
  }
  //TODO: export this function to another file...
  detailsUpdate(event) {
    event.preventDefault();
    let current_user = this.props.state
    console.log("current user: " +JSON.stringify(current_user))
    var error = false
    let updated_user = {
              '_id':current_user._id,
              'username':this.refs.name.value,
             'password':this.refs.password.value,
             'updated_password':this.refs.re_password.value,
             'mobile_no':this.refs.mobile.value
           };
    console.log("update user: "+JSON.stringify(updated_user))
    if(!error && updated_user.username == ""// && updated_user.password==""
      && updated_user.updated_password == "" && updated_user.mobile_no == "" ){
        this.personal_details_msg = "Fill any field to update that."
        console.log('1')
        error = true
    }
    if(!error && updated_user.password == ""
      && updated_user.updated_password != "" ){
        this.personal_details_msg = "Enter current password field to update passsword."
        console.log('6')
        error = true
    }
    if(!error && updated_user.username == current_user.username ||
        updated_user.password == current_user.updated_password ||
          updated_user.mobile_no == current_user.mobile_no ){
        this.personal_details_msg = "Enter updated values for fields to update them."
        error = true
        console.log('5')
    }
     if(!error && current_user.password != updated_user.password
            && updated_user.updated_password != "") {
        this.personal_details_msg = "Current password is not correct."
        error = true
        console.log('2')
      }
       if(!error && current_user.password == updated_user.password && updated_user.updated_password == ""){
        this.personal_details_msg = "Updated password should not be equal to empty string."
        error = true
        console.log('3')
      }
      if(!error && current_user.password == updated_user.updated_password ){
          this.personal_details_msg = "Updated password should not be equal to current password."
          error = true
          console.log('4')
      }
      if(error){
        document.getElementById('personal_details_error').style.display='block';
        document.getElementById('personal_details_msg_div').innerHTML =this.personal_details_msg;
        document.getElementById('personal_details_msg_div').style.color ="red"
        return false
      }else{
        document.getElementById('personal_details_msg_div').innerHTML ="";
        document.getElementById('personal_details_error').style.display='none';
        console.log("current user: " + JSON.stringify(current_user))
        console.log("calling details to handle.")
        if(updated_user.username != ""){
          current_user.username = updated_user.username
        }
        if(updated_user.updated_password != ""){
          current_user.password = updated_user.updated_password
        }
        if(updated_user.mobile_no != ""){
          current_user.mobile_no = updated_user.mobile_no
        }
        console.log("updating user: "+ JSON.stringify(current_user))
        this.props.onDetailsUpdate(current_user)
      }

  }

  addAddress(event) {
    event.preventDefault();

    console.log(this.refs.address1.value)
    console.log(this.refs.city.value)
    let insertAddress = {
              'line1':this.refs.address1.value,
             'line2':this.refs.address2.value,
             'city':this.refs.city.value,
             'state':this.refs.state.value,
             'zipcode':this.refs.zipcode.value
           };
    console.log(insertAddress);
    console.log("call Address to handle." + JSON.stringify(this.props.state))
    this.props.state.address = [...this.props.state.address, insertAddress]
    console.log("call Address to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)
    //this.props.onaddAddress(user);
    document.getElementById('addressFormShow').style.display='none';

  }
  updateAddress(e){
    console.log("update address")
    var id=JSON.parse(e.target.value);

    console.log("id  :: "+ e.target.value)
    var index = id.index
    console.log("index tocuh "+index)
    const i = "state"+index
    //console.log("szdf"+this.refs[i])
    console.log("szdf"+this.refs[i].value)
    //console.log("sasdd"+this.refs.state0.value)
    console.log("sasdd"+this.refs.state0.value)
    //console.log("sassddd"+this.refs.state1.value)
    //console.log("sassddd"+this.refs.zipcode1.value)
    //console.log("sassddd"+this.refs.zipcode1.value)

    var current_user = this.props.state
    console.log("user " + current_user);
    var addresses = []
    current_user.address.map((add)=>{
      console.log(add)
      if(add._id == id._id || add.line1 == id.line1){
        console.log("hu")
        var new_Add = add
        if(this.refs["zipcode"+index].value != ""){
            new_Add["zipcode"] = this.refs["zipcode"+index].value
        }
        if(this.refs["state"+index].value != ""){
            new_Add["state"] = this.refs["state"+index].value
        }
        if(this.refs["city"+index].value != ""){
            new_Add["city"] = this.refs["city"+index].value
        }
        if(this.refs["line2"+index].value != ""){
            new_Add["line2"] = this.refs["line2"+index].value
        }
        if(this.refs["line1"+index].value != ""){
            new_Add["line1"] = this.refs["line1"+index].value
        }
        console.log(new_Add)
        addresses.push(new_Add)
      }else{
        addresses.push(add);
      }
    })
    console.log("address"+JSON.stringify(addresses))
    console.log("new" + current_user);
    this.props.state.address = addresses
    console.log("call Address to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)

  }
  addCard(event){
    event.preventDefault();
    console.log(this.refs.card_number.value)
    console.log(this.refs.month.value)
    let insertCard = {
              'card_number':this.refs.card_number.value,
              'card_type':this.refs.card_type.value,
              'expiration_date':{
                'year':this.refs.year.value,
                'month':this.refs.month.value
              }
           };
    console.log(insertCard);
    console.log("call card to handle." + JSON.stringify(this.props.state))
    this.props.state.card_details = [...this.props.state.card_details, insertCard]
    console.log("call card to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)
    //this.props.addCard(user);
    document.getElementById('cardFormShow').style.display='none';

  }

  updateCard(e){
    console.log("update card")
    var id=JSON.parse(e.target.value);

    console.log("id  :: "+ e.target.value)
    var index = id.index
    console.log("index tocuh "+index)
    const i = "card_number"+index
    console.log("szdf"+this.refs[i].value)

    var current_user = this.props.state
    console.log("user " + current_user);
    var cards = []
    current_user.card_details.map((card)=>{
      console.log(card)
      if(card._id == id._id || card.card_number == id.card_number){
        console.log("hu")
        var newCard = card

        if(this.refs["card_number"+index].value != ""){
            newCard["card_number"] = this.refs["card_number"+index].value
        }
        if(this.refs["card_type"+index].value != ""){
            newCard["card_type"] = this.refs["card_type"+index].value
        }
        if(this.refs["month"+index].value != ""){
            newCard.expiration_date["month"] = this.refs["month"+index].value
        }
        if(this.refs["year"+index].value != ""){
            newCard.expiration_date["year"] = this.refs["year"+index].value
        }
        console.log(newCard)
        cards.push(newCard)
      }else{
        cards.push(card);
      }
    })
    console.log("address"+JSON.stringify(cards))
    console.log("new" + current_user);
    this.props.state.card_details = cards
    console.log("call cards to handle." + JSON.stringify(this.props.state))
    this.props.onDetailsUpdate(this.props.state)

  }


  render(){

    console.log("mydetails "+JSON.stringify(this.props.state))
      var obj=this;

      var addresses=[];
          if(this.props.state.address.length == 0){
            addresses.push(
              <div><h2>No addresses available. please add some to order something.</h2></div>
            );
          }else{
            this.props.state.address.map(function(add,index) {
            console.log(add);
            addresses.push(
              <div><h2>Address {index+1}</h2>
                  <div className="form-group row">
                    <label className="col-sm-4">Address Line 1: </label>
                    <div className="col-sm-8">
                      <input type="text" ref={"line1"+index} className="form-control" placeholder={add.line1} />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-4">Address Line 2: </label>
                    <div className="col-sm-8">
                      <input type="text" ref={"line2"+index} className="form-control" placeholder={add.line2} />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-4">City: </label>
                    <div className="col-sm-8">
                      <input type="text" ref={"city"+index} className="form-control" placeholder={add.city} />
                    </div>
                  </div>


                  <div className="form-group row">
                    <label className="col-sm-4">State: </label>
                    <div className="col-sm-8">

                      <select className="form-control"  ref={"state"+index} ><option value="">{add.state}</option><option value="Andhra Pradesh">Andhra Pradesh</option><option value="Arunachal Pradesh">Arunachal Pradesh</option><option value="Assam">Assam</option><option value="Bihar">Bihar</option><option value="Chhattisgarh">Chhattisgarh</option><option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option><option value="Daman and Diu">Daman and Diu</option><option    value="Delhi">Delhi</option><option value="Goa">Goa</option><option value="Gujarat">Gujarat</option><option value="Haryana">Haryana</option><option value="Himachal Pradesh">Himachal Pradesh</option><option value="Jammu and Kashmir">Jammu and Kashmir</option><option value="Jharkhand">Jharkhand</option><option value="Karnataka">Karnataka</option><option value="Kerala">Kerala</option><option value="Madhya Pradesh">Madhya Pradesh</option><option value="Maharashtra">Maharashtra</option><option value="Manipur">Manipur</option><option value="Meghalaya">Meghalaya</option><option value="Mizoram">Mizoram</option><option value="Nagaland">Nagaland</option><option value="Orissa">Orissa</option><option value="Puducherry">Puducherry</option><option value="Punjab">Punjab</option><option value="Rajasthan">Rajasthan</option><option value="Sikkim">Sikkim</option><option value="Tamil Nadu">Tamil Nadu</option><option value="Telangana">Telangana</option><option value="Tripura">Tripura</option><option value="Uttar Pradesh">Uttar Pradesh</option><option value="Uttarakhand">Uttarakhand</option><option value="West Bengal">West Bengal</option></select>


                    </div>
                  </div>


                  <div className="form-group row">
                    <label className="col-sm-4">ZipCode : </label>
                    <div className="col-sm-8">
                      <input type="text" ref={"zipcode"+index} className="form-control" pattern="[0-9]{6}" placeholder={add.zipcode} />
                    </div>
                  </div>

                  <div className="form-group row">
                      <button className="btn btn-primary"  id="detailsAllowWriteShow" type="submit"
                        value={JSON.stringify({
                          "index":index,
                          "_id":add._id,
                          "line1":add.line1,
                          "line2":add.line2,
                          "city":add.city,
                          "state":add.state,
                          "zipcode":add.zipcode
                        })}
                        onClick={obj.updateAddress}>Update</button>&nbsp;
                      <button className="btn btn-primary"  id="detailsAllowWriteShow" type="submit"
                      value={JSON.stringify({"line1":add.line1,"_id":add._id})} onClick={obj.removeAddress}>Remove</button>
                  </div>

              </div>
                );
            })
          }

          var cards=[];
          if(this.props.state.card_details.length == 0){
            cards.push(
              <div><h2>No Cards available. please add something to order easily.</h2></div>
            );
          }else{
            this.props.state.card_details.map(function(card,index) {
            console.log(card);
            cards.push(
              <div><h1>Card {index+1}</h1>
              <div className="form-group row">
                <label className="col-sm-4">Card Type:</label>
                <div className="col-sm-8">
                  <select className="form-control" ref={"card_type"+index} >
                      <option value="">{card.card_type}</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-4">Card Number: </label>
                <div className="col-sm-8">
                  <input type="text" ref={"card_number"+index} className="form-control" pattern="[0-9]{16}" placeholder={card.card_number}  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-4">Expiration Date: </label>
                <div className="col-sm-8">
                <input type="number" ref={"month"+index} className="form-control" min="1" max="12" placeholder={card.expiration_date.month}  />
                <input type="number" ref={"year"+index} className="form-control" min="2017" placeholder={card.expiration_date.year}  />
                </div>
              </div>

              <div className="form-group row">
                  <button className="btn btn-primary"  id="detailsAllowWriteShow" type="submit"
                    value={JSON.stringify({
                      "index":index,
                      "_id":card._id,
                      "card_type":card.card_type,
                      "card_number":card.card_number,
                      "month":card.month,
                      "year":card.year,
                    })}
                    onClick={obj.updateCard}>Update</button>&nbsp;
                  <button className="btn btn-primary"  id="detailsAllowWriteShow" type="submit"
                  value={JSON.stringify({"card_number":card.card_number,"_id":card._id})} onClick={obj.removeCard}>Remove</button>
              </div>

            </div>
                );
            })
          }


    return (
        <div>
            <center>
            <form onSubmit={this.detailsUpdate}  className="form-horizontal form-signin"
              style={{"border":"1px solid #ccc","borderRadius":"10px"}}>
              <div style={{"width":"40%","marginTop":"10px"}} className={"panel panel-default"} >
                <div className="form-group row">
                  <label className="col-sm-4">Email ID: </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id='emailid' ref="emailid" value={this.props.state._id} readOnly />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4">Name: </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="name" ref="name" placeholder={this.props.state.username} readOnly />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4">Current Password: </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="password" ref="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                      placeholder="Fill this to change password(*only)" readOnly />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4">Change Password: </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="re_password" ref="re_password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                      placeholder="Enter current password to update password" readOnly />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4">Mobile No.: </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="mobile" ref="mobile" pattern="[0-9]{10}"  placeholder={this.props.state.mobile_no} readOnly />
                  </div>
                </div>
              </div>
              <div id="personal_details_error" ref="personal_details_error"  style={{display:'none'}} >
                  <div className="form-group row">
                      <div id="personal_details_msg_div"></div>
                  </div>
              </div>
              <div id="detailsUpdateDiv" style={{display:'none'}}>
                  <div className="form-group row">
                      <button className="btn btn-primary" type="submit">Update</button>
                  </div>
              </div>
            </form>
              <div className="form-group row">
                <button className="btn btn-primary"  id="detailsAllowWriteShow" type="submit"
                  onClick={()=>{this.detailsAllowWrite()}}>Want to Update your Details? </button>
              </div>

            </center><br/>
            <center><div style={{"width":"40%","marginTop":"10px"}} className={"panel panel-default"} >
            {addresses}
            </div></center><br/>

            <center>
                <div className="form-group row">
                  <button className="btn btn-primary"  id="addressShow" type="submit"
                    onClick={()=>{this.addressShow()}}>Want to add Address</button>
                </div>
            </center>
            <div id="addressFormShow" style={{display:'none'}}>
                <center>
                    <div className="form-group row">
                      <button className="btn btn-primary"  id="hide" type="submit"
                        onClick={()=>{this.addressHide()}}>Want to skip to add Address right now?</button>
                    </div>
                </center>
                <form onSubmit={this.addAddress}  className="form-horizontal form-signin"
                  style={{"border":"1px solid #ccc","borderRadius":"10px"}}>
                  <div>
                    <center><div style={{"width":"40%"}} className={"panel panel-default"} >
                      <div className={"panel-heading"} style={{"backgroundColor":"rgb(51,122,183)","color":"white"}}><strong>Add Address</strong></div>
                      <div id="divLogin" className={"bgImage panel-body"} style={{"backgroundColor":"#eee"}}>
                          <div className="form-group row">
                            <label className="col-sm-4">Address Line 1:</label>
                            <div className="col-sm-8">
                              <input type="text" className="form-control" ref="address1" required placeholder="address line 1"/>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">Address Line 2:</label>
                            <div className="col-sm-8">
                              <input type="text" className="form-control" ref="address2" required placeholder="address line 2"/>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">City/Town</label>
                            <div className="col-sm-8">
                              <input type="text" className="form-control" ref="city" required placeholder="city"/>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">State</label>
                            <div className="col-sm-8">
                              <select className="form-control"  ref="state" required><option value="">Select State</option><option value="Andhra Pradesh">Andhra Pradesh</option><option value="Arunachal Pradesh">Arunachal Pradesh</option><option value="Assam">Assam</option><option value="Bihar">Bihar</option><option value="Chhattisgarh">Chhattisgarh</option><option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option><option value="Daman and Diu">Daman and Diu</option><option    value="Delhi">Delhi</option><option value="Goa">Goa</option><option value="Gujarat">Gujarat</option><option value="Haryana">Haryana</option><option value="Himachal Pradesh">Himachal Pradesh</option><option value="Jammu and Kashmir">Jammu and Kashmir</option><option value="Jharkhand">Jharkhand</option><option value="Karnataka">Karnataka</option><option value="Kerala">Kerala</option><option value="Madhya Pradesh">Madhya Pradesh</option><option value="Maharashtra">Maharashtra</option><option value="Manipur">Manipur</option><option value="Meghalaya">Meghalaya</option><option value="Mizoram">Mizoram</option><option value="Nagaland">Nagaland</option><option value="Orissa">Orissa</option><option value="Puducherry">Puducherry</option><option value="Punjab">Punjab</option><option value="Rajasthan">Rajasthan</option><option value="Sikkim">Sikkim</option><option value="Tamil Nadu">Tamil Nadu</option><option value="Telangana">Telangana</option><option value="Tripura">Tripura</option><option value="Uttar Pradesh">Uttar Pradesh</option><option value="Uttarakhand">Uttarakhand</option><option value="West Bengal">West Bengal</option></select>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">ZipCode</label>
                            <div className="col-sm-8">
                              <input type="text" className="form-control" ref="zipcode" pattern="[0-9]{6}"  required placeholder="pin"/>
                            </div>
                          </div>
                      </div>
                      </div>
                    </center>

                  </div>
                    <center><div className="form-group row">
                      <button className="btn btn-primary" type="submit">Add Address</button>
                    </div></center>
                </form>
            </div>

            <center><div style={{"width":"40%","marginTop":"10px"}} className={"panel panel-default"} >
            {cards}
            </div></center><br/>

            <center>
                <div className="form-group row">
                  <button className="btn btn-primary"  id="cardShow" type="submit"
                    onClick={()=>{this.cardShow()}}>Want to add Card Details</button>
                </div>
            </center>
            <div id="cardFormShow" style={{display:'none'}}>
                <center>
                    <div className="form-group row">
                      <button className="btn btn-primary"  id="cardHide" type="submit"
                        onClick={()=>{this.cardHide()}}>Want to skip adding Card right now?</button>
                    </div>
                </center>
                <form onSubmit={this.addCard}  className="form-horizontal form-signin"
                  style={{"border":"1px solid #ccc","borderRadius":"10px"}}>
                  <div>
                    <center><div style={{"width":"40%"}} className={"panel panel-default"} >
                      <div className={"panel-heading"} style={{"backgroundColor":"rgb(51,122,183)","color":"white"}}><strong>Add Card</strong></div>
                      <div id="divLogin" className={"bgImage panel-body"} style={{"backgroundColor":"#eee"}}>
                          <div className="form-group row">
                            <label className="col-sm-4">Card Type:</label>
                            <div className="col-sm-8">
                              <select className="form-control"  ref="card_type" required>
                                  <option value="">Card Type</option>
                                  <option value="credit">Credit</option>
                                  <option value="debit">Debit</option>
                                </select>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">Card Number:</label>
                            <div className="col-sm-8">
                              <input type="text" className="form-control" ref="card_number" pattern="[0-9]{16}" required placeholder="Card Number"/>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-sm-4">Expiration Date</label>
                            <div className="col-sm-8">
                              Month:<input type="number" className="form-control" ref="month" min="1" max="12"  required placeholder="MM"/>
                              Year:<input type="number" className="form-control" ref="year" min="2017"  required placeholder="YYYY"/>
                            </div>
                          </div>
                      </div>
                      </div>
                    </center>
                  </div>
                    <center><div className="form-group row">
                        <button className="btn btn-primary" type="submit">Add this Card</button>
                    </div></center>
                </form>
            </div>


        </div>
    );
  }
}

//export default MyDetails;
export default connect(mapStateToProps,mapDispatchToProps)(MyDetails);
