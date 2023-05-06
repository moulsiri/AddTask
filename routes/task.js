const mongoose=require('mongoose');

const schema=mongoose.Schema({
    name:String,
    type:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})

module.exports=mongoose.model('task',schema)