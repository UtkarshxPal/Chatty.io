const mongoose = require("mongoose") ; 

async function connectDB(){
       try{
         const conn = await mongoose.connect(process.env.MONGODB_URI)
         console.log(`MongoDB Connected: ${conn.connection.host}`) ; 
       }
       catch(err){
            console.log("Error: " , err) ; 
            process.exit(1) ; 
       }
}

module.exports = connectDB ; 
