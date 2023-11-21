const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
userId :{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'user'
},
listenerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'listener' // Reference to another model, replace 'anotherModel' with the actual model name
  },
token:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    required:true
},
expiresAt:{
    type:Date,
    required:true
}
})

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token 