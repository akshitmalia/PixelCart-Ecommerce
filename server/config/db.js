import mongoose from "mongoose";

async function connectDB(){
    try{
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB is Connnected !!!");

    }
    catch(error){
        console.log("MongoDB NOT CONNECTED");
    }
}

export default connectDB;