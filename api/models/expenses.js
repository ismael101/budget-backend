const mongoose = require('mongoose')

const expensesSchema = mongoose.Schema({
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
    date:{
        type:Date,
        default: new Date()
    },
}) 

module.exports = expensesSchema