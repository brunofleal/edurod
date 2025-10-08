const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    code: {
        type: Number,
    },
});

module.exports = mongoose.model("Line", LineSchema);
