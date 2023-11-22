const mongoose = require('mongoose')

const musicSchema = mongoose.Schema({
user :{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'
},

name: {
    type:String,
    required:[true, 'please add a name'],
    trim:true
},

genre: {
    type:String,
    required:[true,'please add a genre'],
    trim:true
},

description: {
    type:String,
    required:[true,'please add a description'],
    trim:true
},
image: {
    type:Object,
   default:{}
},
audio: {
    type:Object,
   default:{}
}

},{
    timestamps:true
})

const Music = mongoose.model('Music', musicSchema)
module.exports = Music