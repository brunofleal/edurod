const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    code: {
        type: Number,
    },
});

module.exports = mongoose.model("Line", LineSchema);
