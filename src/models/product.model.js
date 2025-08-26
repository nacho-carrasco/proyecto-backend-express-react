import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    // Campo principal (name en Atlas, nombre en frontend)
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    // SKU único
    sku: {
        type: String,
        trim: true
    },
    
    // Información básica
    categoria: {
        type: String,
        trim: true
    },
    
    descripcion: {
        type: String,
        trim: true
    },
    
    // Precio y moneda
    precio: {
        type: Number,
        min: 0
    },
    
    moneda: {
        type: String,
        default: 'EUR',
        enum: ['EUR', 'USD', 'GBP']
    },
    
    // Inventario
    cantidad: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Características físicas
    dimensiones: {
        ancho_cm: { type: Number, min: 0 },
        fondo_cm: { type: Number, min: 0 },
        alto_cm: { type: Number, min: 0 }
    },
    
    material: {
        type: String,
        trim: true
    },
    
    color: {
        type: String,
        trim: true
    },
    
    peso_kg: {
        type: Number,
        min: 0
    },
    
    // Imágenes
    imagen: {
        type: String,
        trim: true
    },
    
    imagenes: [{
        type: String,
        trim: true
    }],
    
    // Etiquetas para búsqueda
    etiquetas: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    
    // Metadatos
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    
    activo: {
        type: Boolean,
        default: true
    }
    
}, {
    // Opciones del schema
    timestamps: { 
        createdAt: 'fechaCreacion', 
        updatedAt: 'fechaActualizacion' 
    },
    
    // Configuración de JSON
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

// Middleware pre-save
productSchema.pre('save', function(next) {
    this.fechaActualizacion = new Date();
    
    // Generar SKU automático si no existe
    if (!this.sku && this.name) {
        const prefijo = this.categoria ? this.categoria.substring(0, 3).toUpperCase() : 'PRD';
        this.sku = `${prefijo}-${Date.now()}`;
    }
    
    next();
});

// El modelo debe usar exactamente el nombre de la colección en Atlas
const ProductModel = model('productos', productSchema); // 'productos' coincide con tu colección

export default ProductModel;