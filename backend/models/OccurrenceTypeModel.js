const mongoose = require("mongoose");

const OccurrenceSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    points: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("OccurrenceType", OccurrenceSchema);
