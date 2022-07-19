const express = require("express")
const router =  new express.Router()
const Message  =require("./Messagestructure.js")
const User = require("./userStructure.js")
const jwt  =require("jsonwebtoken")

const handleErrors = (err) =>{
  let errors = {email:'',password:''}
 
  if(err.code===11000){
    errors.email = 'Email already taken'
    return errors
  }

  if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(error =>{
      errors[error.properties.path] = error.properties.message
    })
  }
  return errors
}
const maxAge = 3*24*60*60
 const createToken = (id) =>{
    return jwt.sign({id},'Hello this is harsh and i have made this',{
      expiresIn:maxAge
    })
 }

router.get("/",(req,res)=>{
    res.status(200).send("hello")
 })


 router.get("/messages",async(req,res)=>{
    try{
       const result =await Message.find();
       res.status(200).send(result)
    }catch(err){
       res.status(500).send(err)
    }
 })

 router.post("/messages",async(req,res)=>{
     try{
       const mess = new Message(req.body)
       const result =await mess.save()
       res.status(201).send(result)
     }catch(err){
       res.status(400).send(err)
     }
 })

 // user's crud operation

 router.post("/user",async(req,res)=>{
  try{
    const userNew = new User(req.body)
    const result =await userNew.save()
    const token = createToken(result.id)
    res.cookie('jwt',token,{ maxAge:maxAge*1000})
    res.status(201).send({result:result._id})
    console.log(token);
  }catch(err){
   const error = handleErrors(err)
    res.status(400).json({error})
  }
})



module.exports = router