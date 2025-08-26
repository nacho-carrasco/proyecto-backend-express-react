// models/modeloAngular.model.js
import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El campo 'nombre' es obligatorio"],
            trim: true
        },
        imagen: {
            type: String, // Guardará la ruta o nombre del archivo
            required: false
        }
    },
    {
        strict: false, // Permite campos extra
        timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" },
        versionKey: false
    }
);

const reactModel = mongoose.model("reactModelos", modelSchema);

export {
    reactModel
};
