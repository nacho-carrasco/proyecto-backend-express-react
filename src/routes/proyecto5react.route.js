import express from "express";
import { upload } from "../middlewares/middleware-subidaArchivos.js";

// Importar el nuevo controlador de productos
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    saludarReact
} from "../controllers/reactController.js";

const enrutadorReact = express.Router();

// Ruta de saludo/test
enrutadorReact.get("/saludar", saludarReact);

// ========== RUTAS CRUD PARA PRODUCTOS ==========

// GET - Obtener todos los productos (desde MongoDB Atlas)
enrutadorReact.get("/", obtenerProductos);

// GET - Obtener producto por ID
enrutadorReact.get("/:id", obtenerProductoPorId);

// POST - Crear nuevo producto
enrutadorReact.post(
    "/",
    upload.single("imagen"), // Middleware para subir archivos
    crearProducto
);

// PUT - Actualizar producto
enrutadorReact.put(
    "/:id",
    upload.single("imagen"), // Middleware para subir archivos
    actualizarProducto
);

// DELETE - Eliminar producto
enrutadorReact.delete("/:id", eliminarProducto);

export { enrutadorReact };