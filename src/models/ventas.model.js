import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
    {
    },
    {
        strict: false, // Permite campos extra
        timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" },
        versionKey: false
    }
);

const ventasModel = mongoose.model("ventas", modelSchema);

export {
    ventasModel
};
