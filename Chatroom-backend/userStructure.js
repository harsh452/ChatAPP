const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid EMAIL")
            }
        },
        unique:true,
        required:[true,'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required'] ,
        minlength:[6,'Password should be of atleast 6 cahracters']
    }

})

userSchema.pre('save',async function(next){
    console.log('new user is about to be created',this);
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User = new mongoose.model("user",userSchema)

module.exports = User