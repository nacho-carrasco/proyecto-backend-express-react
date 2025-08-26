import express from 'express';

// Importar solo las rutas que vamos a usar
import { enrutadorReact } from './proyecto5react.route.js';
import { enrutadorVentas } from './proyecto5ventas.route.js';

const indexRouter = express.Router();

// Ruta de bienvenida/estado del servidor
indexRouter.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Backend API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            react: {
                base: '/api/proyecto5/react',
                test: '/api/proyecto5/react/saludar',
                description: 'CRUD completo para React'
            },
            ventas: {
                base: '/api/proyecto5/ventas',
                test: '/api/proyecto5/ventas/saludar',
                description: 'Sistema de ventas'
            }
        }
    });
});

// Ruta de salud del servidor (health check)
indexRouter.get('/health', (req, res) => {
    res.status(200).json({
        ok: true,
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Rutas de las APIs
indexRouter.use('/api/proyecto5/react', enrutadorReact);
indexRouter.use('/api/proyecto5/ventas', enrutadorVentas);

// Ruta para servir vistas EJS (si las necesitas)
indexRouter.get('/dashboard', (req, res) => {
    res.render('index', { 
        titulo: 'Backend API Dashboard',
        numero: new Date().getFullYear(),
        parrafo: 'API REST para proyecto React funcionando correctamente',
        numeros: [1, 2, 3, 4, 5],
        productos: [
            { nombre: 'API React funcionando' },
            { nombre: 'API Ventas disponible' }, 
            { nombre: 'CORS configurado' },
            { nombre: 'MongoDB conectado' },
            { nombre: 'Subida de archivos activa' }
        ]
    });
});

export { indexRouter };