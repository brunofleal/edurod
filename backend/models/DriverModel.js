const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        matricula: {
            type: Number,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
