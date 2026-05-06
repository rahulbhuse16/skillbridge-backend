import mongoose from "mongoose";

const DB_URL= `mongodb+srv://rahulbhuse2001_db_user:ya6caFHt5abQy77c@skillbridge-cluster.uanyr3o.mongodb.net/?appName=skillbridge-cluster`

export const connectDB=async()=>{

    try{
        await mongoose.connect(DB_URL)
        console.log("DB connected")

    }
    catch(err){
        console.log(err)
    }

}