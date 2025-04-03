const { cyan } = require("colors");
const dotenv = require("dotenv"); 
dotenv.config();
const MONGO=process.env.MONGO_URI;
const mongoose=require("mongoose");
const connectDB = async() =>{
    try{
        const conn=await mongoose.connect(MONGO );
        console.log(`MongoDB Connected :${conn.connection.host}`.cyan.underline );
    }catch (error) {
        console.log(`Error: ${error}`.red.bold);
        process.exit();
    }
}
module.exports=connectDB;