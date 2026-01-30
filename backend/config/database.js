import mongoose from 'mongoose';

// URL de conexión tomada desde las variables de entorno
// Usa DATABASE_URL definida en backend/.env
const DB_URL = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
