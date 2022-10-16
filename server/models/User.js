const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        reuired:true,
    },
    email:{
        type:String,
        reuired:true,
        unique:true,
    },
    password:{
        type:String,
        reuired:true,
        minLength:6,
    },
})

module.exports = mongoose.model("User",userSchema);