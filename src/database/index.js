import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`mongoDB is connected ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error("MongoDB Connection Failed!!", err);
        process.exit(1);
    }
}

export default connectDB;