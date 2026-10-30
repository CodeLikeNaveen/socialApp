import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/socialApp`,{
            maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS: 45000,
        })

        mongoose.connection.on('error', (err)=>{
            console.log('❌ DB Connection Error:', err)
        })

        mongoose.connection.on('connected', ()=>{
            console.log('✅ DataBase Connected')
        })

        mongoose.connection.on('disconnected', ()=>{
            console.log('⚠️ DataBase Disconnected!')
        })
        

        
    } catch (error) {
        console.log("❌ DB connection Failed: ",error.message);
        process.exit(1);
    }
}

export default connectDB