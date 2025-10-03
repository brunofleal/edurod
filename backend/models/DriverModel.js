const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    matricula: {
        type: Number,
    },
});

module.exports = mongoose.model("Driver", DriverSchema);
