import mongoose from 'mongoose';

async function conectarBBDD(urlDataBase) {
    try {
        // Configuración específica para MongoDB Atlas (sin opciones deprecated)
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
            socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
        };

        console.log('Base de datos: Intentando conectar a MongoDB Atlas...');
        console.log('Base de datos: URL:', urlDataBase.replace(/:[^:]*@/, ':****@')); // Ocultar password en logs
        
        await mongoose.connect(urlDataBase, options);
        console.log('Base de datos: ✅ Conectado a MongoDB con Mongoose.');
    } catch (error) {
        console.log('Base de datos: ❌ Error en la conexión con Mongoose:');
        console.log('Error tipo:', error.name);
        console.log('Error mensaje:', error.message);
        
        // Sugerencias según el tipo de error
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Sugerencia: Verifica la URL de conexión');
        } else if (error.message.includes('authentication failed')) {
            console.log('💡 Sugerencia: Verifica usuario y contraseña');
        } else if (error.message.includes('MongoServerSelectionError')) {
            console.log('💡 Sugerencia: Verifica la configuración de red en MongoDB Atlas');
            console.log('💡 Añade tu IP a la lista de IPs permitidas: 0.0.0.0/0');
        }
        
        throw error; // Re-lanzar el error para que se maneje en www
    }
}

export { conectarBBDD };
