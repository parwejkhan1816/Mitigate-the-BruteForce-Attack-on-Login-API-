const mongoose = require("mongoose") ; 


const ListSchema = new mongoose.Schema({
    tittle:{
        type: String,
        require: true
    } , 
    body: {
        type: String,
        require: true 
    } ,
    user: [{
        type: mongoose.Types.ObjectId,
        ref: "User" , 
    }]
},{
    timestamps : true
}) ;

module.exports = mongoose.model("List",ListSchema) ;