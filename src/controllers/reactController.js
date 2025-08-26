import ProductModel from '../models/product.model.js';

// ========== FUNCIONES DE MAPEO ==========

// Convertir de MongoDB Atlas a formato Frontend
function mapearProductoMongoAFrontend(productoMongo) {
    return {
        _id: productoMongo._id,
        nombre: productoMongo.name || productoMongo.nombre,  // Mapear name -> nombre
        imagen: productoMongo.imagen,
        precio: productoMongo.precio,
        descripcion: productoMongo.descripcion,
        categoria: productoMongo.categoria,
        sku: productoMongo.sku,
        cantidad: productoMongo.cantidad,
        material: productoMongo.material,
        color: productoMongo.color,
        dimensiones: productoMongo.dimensiones,
        peso_kg: productoMongo.peso_kg,
        etiquetas: productoMongo.etiquetas,
        imagenes: productoMongo.imagenes,
        moneda: productoMongo.moneda,
        fechaCreacion: productoMongo.fechaCreacion,
        fechaActualizacion: productoMongo.fechaActualizacion
    };
}

// Convertir de Frontend a formato MongoDB Atlas
function mapearProductoFrontendAMongo(productoFrontend) {
    const datos = {
        name: productoFrontend.nombre || productoFrontend.name,
        imagen: productoFrontend.imagen,
        precio: productoFrontend.precio || 0,
        descripcion: productoFrontend.descripcion || '',
        categoria: productoFrontend.categoria || 'General',
        sku: productoFrontend.sku || 'SKU-' + Date.now(),
        cantidad: productoFrontend.cantidad || 1,
        material: productoFrontend.material || '',
        color: productoFrontend.color || '',
        dimensiones: productoFrontend.dimensiones || {},
        peso_kg: productoFrontend.peso_kg || 0,
        etiquetas: productoFrontend.etiquetas || [],
        imagenes: productoFrontend.imagenes || [],
        moneda: productoFrontend.moneda || 'EUR',
        fechaActualizacion: new Date()
    };
    
    // Limpiar campos undefined
    Object.keys(datos).forEach(key => {
        if (datos[key] === undefined) {
            delete datos[key];
        }
    });
    
    return datos;
}

// ========== CONTROLADORES ==========

// GET - Obtener todos los productos
export async function obtenerProductos(req, res) {
    try {
        console.log('🔍 [ReactController] Obteniendo productos de MongoDB Atlas...');
        
        const productos = await ProductModel.find({ activo: { $ne: false } });
        console.log(`📦 [ReactController] Encontrados ${productos.length} productos en la colección 'productos'`);
        
        if (productos.length === 0) {
            console.log('⚠️ [ReactController] No hay productos en la base de datos');
            return res.status(200).json({
                ok: true,
                mensaje: "No hay productos en la base de datos",
                data: []
            });
        }
        
        // Mapear productos de MongoDB a formato del frontend
        const productosMapeados = productos.map(mapearProductoMongoAFrontend);
        
        console.log('✅ [ReactController] Productos mapeados correctamente');
        console.log('📋 [ReactController] Primer producto:', productosMapeados[0]);
        
        res.status(200).json({
            ok: true,
            mensaje: "Lista de productos obtenida correctamente",
            data: productosMapeados,
            total: productosMapeados.length
        });
        
    } catch (error) {
        console.error('❌ [ReactController] Error al obtener productos:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al obtener productos",
            error: error.message
        });
    }
}

// GET - Obtener producto por ID
export async function obtenerProductoPorId(req, res) {
    try {
        const { id } = req.params;
        console.log(`🔍 [ReactController] Buscando producto con ID: ${id}`);
        
        const producto = await ProductModel.findById(id);
        
        if (!producto) {
            console.log(`❌ [ReactController] Producto con ID ${id} no encontrado`);
            return res.status(404).json({
                ok: false,
                mensaje: "Producto no encontrado"
            });
        }
        
        const productoMapeado = mapearProductoMongoAFrontend(producto);
        
        console.log('✅ [ReactController] Producto encontrado y mapeado');
        
        res.status(200).json({
            ok: true,
            mensaje: "Producto encontrado",
            data: productoMapeado
        });
        
    } catch (error) {
        console.error(`❌ [ReactController] Error al buscar producto:`, error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al buscar producto",
            error: error.message
        });
    }
}

// POST - Crear nuevo producto
export async function crearProducto(req, res) {
    try {
        console.log('➕ [ReactController] Creando nuevo producto...');
        console.log('📝 [ReactController] Datos recibidos:', req.body);
        
        // Mapear datos del frontend a formato MongoDB
        const datosProducto = mapearProductoFrontendAMongo(req.body);
        datosProducto.fechaCreacion = new Date();
        
        // Manejar archivo subido
        if (req.file) {
            datosProducto.imagen = req.file.filename;
        }
        
        console.log('🔄 [ReactController] Datos mapeados para MongoDB:', datosProducto);
        
        const nuevoProducto = new ProductModel(datosProducto);
        const productoGuardado = await nuevoProducto.save();
        
        // Mapear de vuelta al formato del frontend para la respuesta
        const productoRespuesta = mapearProductoMongoAFrontend(productoGuardado);
        
        console.log('✅ [ReactController] Producto creado exitosamente con ID:', productoGuardado._id);
        
        res.status(201).json({
            ok: true,
            mensaje: "Producto creado exitosamente",
            data: productoRespuesta
        });
        
    } catch (error) {
        console.error('❌ [ReactController] Error al crear producto:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al crear producto",
            error: error.message
        });
    }
}

// PUT - Actualizar producto
export async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        console.log(`📝 [ReactController] Actualizando producto con ID: ${id}`);
        console.log('📝 [ReactController] Datos recibidos:', req.body);
        
        // Mapear datos del frontend a formato MongoDB
        const datosActualizacion = mapearProductoFrontendAMongo(req.body);
        
        // Manejar archivo subido
        if (req.file) {
            datosActualizacion.imagen = req.file.filename;
        }
        
        console.log('🔄 [ReactController] Datos mapeados para actualización:', datosActualizacion);
        
        const productoActualizado = await ProductModel.findByIdAndUpdate(
            id, 
            datosActualizacion, 
            { new: true, runValidators: true }
        );
        
        if (!productoActualizado) {
            console.log(`❌ [ReactController] Producto con ID ${id} no encontrado para actualizar`);
            return res.status(404).json({
                ok: false,
                mensaje: "Producto no encontrado"
            });
        }
        
        // Mapear de vuelta al formato del frontend
        const productoRespuesta = mapearProductoMongoAFrontend(productoActualizado);
        
        console.log('✅ [ReactController] Producto actualizado exitosamente');
        
        res.status(200).json({
            ok: true,
            mensaje: "Producto actualizado exitosamente",
            data: productoRespuesta
        });
        
    } catch (error) {
        console.error('❌ [ReactController] Error al actualizar producto:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al actualizar producto",
            error: error.message
        });
    }
}

// DELETE - Eliminar producto
export async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;
        console.log(`🗑️ [ReactController] Eliminando producto con ID: ${id}`);
        
        // Usar eliminación suave (marcar como inactivo) o eliminación real
        const productoEliminado = await ProductModel.findByIdAndDelete(id);
        
        if (!productoEliminado) {
            console.log(`❌ [ReactController] Producto con ID ${id} no encontrado para eliminar`);
            return res.status(404).json({
                ok: false,
                mensaje: "Producto no encontrado"
            });
        }
        
        console.log('✅ [ReactController] Producto eliminado exitosamente');
        
        res.status(200).json({
            ok: true,
            mensaje: "Producto eliminado exitosamente",
            data: { _id: id }
        });
        
    } catch (error) {
        console.error('❌ [ReactController] Error al eliminar producto:', error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor al eliminar producto",
            error: error.message
        });
    }
}

// GET - Endpoint de prueba
export async function saludarReact(req, res) {
    try {
        const totalProductos = await ProductModel.countDocuments();
        
        res.status(200).json({
            ok: true,
            mensaje: "Controlador React funcionando correctamente",
            timestamp: new Date().toISOString(),
            totalProductos: totalProductos,
            coleccion: "productos"
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error en el controlador React",
            error: error.message
        });
    }
}