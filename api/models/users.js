const mongoose = require('mongoose')
const expenses = require('./expenses')
const bills = require('./bills')
const savings = require('./savings')
const income = require('./income')
const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{
        type:String, 
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    },
    password:{
        type:String, 
        required:true
    },
    bills:[bills],
    income:[income],
    expenses:[expenses],
    savings:[savings]


})
module.exports = mongoose.model('User', userSchema)