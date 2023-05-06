const validator=require('validator')
const mongodb=require('mongoose');

mongodb.connect(env.process.MONGOURI)
const schema=mongodb.Schema({
  name:String,
  email:{
    type:String,
    // unique:true
    validate:[validator.isEmail,"Please enter the valid email"]
  },
  mobile:{
    type:String,
    // unique:true
  }

});
module.exports=mongodb.model('users',schema);