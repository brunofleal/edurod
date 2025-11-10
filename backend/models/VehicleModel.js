const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
    {
        code: { type: Number, required: true, unique: true },
        plate: { type: String, required: true, unique: true },
        date: { type: Date },
        nChassi: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
