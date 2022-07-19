const mongoose = require("mongoose")
const validator = require("validator")

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    timestamp: {
        type:String,
        default: new Date().toISOString()
    },
    received:Boolean
})

const Message = new mongoose.model("message",messageSchema);

module.exports  = Message