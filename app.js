// Importaciones de módulos nativos
import path from 'path';
import { fileURLToPath } from 'url';

// Importaciones de librerías de terceros
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Importaciones de configuración
import { configureCookieExpressSession } from './src/config/cookie-usuario-session.config.js';

// Importaciones de middlewares (CON LA RUTA CORRECTA)
import { middlewareExpressHttpError } from './src/middlewares/middlewares-express/middleware-express-http-errors.js';
import { middlewareExpressGlobalError } from './src/middlewares/middlewares-express/middleware-express-global-errors.js';

// Importaciones de rutas
import { indexRouter } from './src/routes/index.router.js';

// Configuración inicial
dotenv.config();

// Configuración para ES modules (equivalente a __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear la aplicación Express
const app = express();

// Configuración de vistas (para las vistas EJS que ya tienes)
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Middlewares básicos
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS para desarrollo y producción
app.use(cors({
    origin: [
        'http://localhost:3000',  // React dev server (Create React App)
        'http://localhost:5173',  // Vite dev server
        'http://localhost:4200',  // Angular dev server
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:4200'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Configuración de sesiones
app.use(configureCookieExpressSession());

// Rutas principales (todas tus APIs van aquí)
app.use('/', indexRouter);

// Middleware para capturar rutas no encontradas (404)
app.use(middlewareExpressHttpError);

// Middleware global de manejo de errores
app.use(middlewareExpressGlobalError);

// Exportación por defecto
export default app;