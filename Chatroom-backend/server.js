const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const mongoose = require("mongoose")
const routesData = require("./router")
const Pusher = require("pusher")
const cors =  require("cors")
const cookieParser = require("cookie-parser")
const pusher = new Pusher({
    appId: "1438205",
    key: "431ec5a2c10127fc36e8",
    secret: "608d60d45ab3687b5f6f",
    cluster: "ap2",
    useTLS: true
  });
  

app.use(express.json())
app.use(cors());
app.use(routesData)
app.use(cookieParser())


mongoose.connect('mongodb+srv://harsh_1209:Hcverma%401209@cluster0.i8ss2lw.mongodb.net/?retryWrites=true&w=majority').then(()=>{
  console.log("database connected");
})

const db = mongoose.connection
db.once('open',async()=>{
    console.log("db is connected");
    const msgCollection =db.collection('messages')
    const changeStream = msgCollection.watch()
    

    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType === 'insert'){
          const messageDetails = change.fullDocument;
          pusher.trigger('messages','inserted',{
            name: messageDetails.name,
            message: messageDetails.message,
            timestamp: messageDetails.timestamp,
            received: messageDetails.received
          })
        }else{
          console.log('error triggering pusher');
        }
    })

})



app.listen(port,()=>{
    console.log(`server is running on ${port } `);
})