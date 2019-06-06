const mongoose = require('mongoose')

const billSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },
    for:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    due:{
        type:Date,
        default: new Date(+new Date() + 7*24*60*60*1000)
    },
    paid:{
        type:Boolean,
        default: false
    },
}) 

module.exports = billSchema