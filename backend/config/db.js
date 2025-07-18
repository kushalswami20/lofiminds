import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://niyatiimishra2005:123@cluster0.4znc2oo.mongodb.net/mindful_app?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
