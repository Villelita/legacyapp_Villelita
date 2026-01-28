import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔌 Intentando conectar a MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@') || 'No configurada');
    
    await connectDB();
    
    console.log('✅ Conexión exitosa a MongoDB!');
    console.log('📊 Información de la conexión:');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Database:', mongoose.connection.name);
    console.log('   - Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
    
    // Verificar que las colecciones puedan ser accedidas
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Colecciones existentes:', collections.length);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:');
    console.error('   Mensaje:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verifica que MONGODB_URI esté correctamente configurada en .env');
    console.error('   2. Si usas Atlas, verifica que tu IP esté en la whitelist');
    console.error('   3. Verifica que el usuario y contraseña sean correctos');
    console.error('   4. Si usas MongoDB local, verifica que el servicio esté corriendo');
    process.exit(1);
  }
};

testConnection();
