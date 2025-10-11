const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        matricula: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
