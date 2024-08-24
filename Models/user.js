const mongoose = require("mongoose") ; 

const userSchema  = new mongoose.Schema({
    email: {
       type: String,
       unique:true ,
       require: true 
    },
    password:{
        type: String,
        require: true
    },
    releaseTime:{
        type: Date , 
        default: new Date(),
        require: true
    },
    loginAttempt:{
        type: Number ,
        default: 0,
        require: true
    }
}) ;

module.exports = mongoose.model("User",userSchema) ; 