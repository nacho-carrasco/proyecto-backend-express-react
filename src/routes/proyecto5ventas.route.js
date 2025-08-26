import express from "express";
import { upload } from "../middlewares/middleware-subidaArchivos.js";
import { ventasModel } from "../models/ventas.model.js";

const enrutadorVentas = express.Router();

enrutadorVentas.get("/saludar", (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: "¡Hola desde la ruta de VENTAS! La conexión con el backend funciona correctamente!!!"
    });
});

enrutadorVentas.get("/", async (req, res) => {
    try {
        const resultado = await ventasModel.find();

        res.status(200).json({
            ok: true,
            mensaje: "Lista de documentos",
            data: resultado
        });
    } catch (error) {
        console.log("Error GET ALL:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener los documentos",
            error: error.message
        });
    }
});

enrutadorVentas.post(
    "/",
    upload.single("imagen"),
    async (req, res) => {
        try {
            const datos = { ...req.body };

            if (req.file) {
                datos.imagen = req.file.filename;
            }

            const nuevoDoc = new ventasModel(datos);
            const guardado = await nuevoDoc.save();

            res.status(201).json({
                ok: true,
                mensaje: "Documento creado",
                data: guardado
            });
        } catch (error) {
            console.log("Error POST:", error);
            res.status(400).json({
                ok: false,
                mensaje: "Error al crear el documento",
                error: error.message
            });
        }
    }
);

export { enrutadorVentas };
