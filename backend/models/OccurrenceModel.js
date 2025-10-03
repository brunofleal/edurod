const mongoose = require("mongoose");

const OccurrenceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    driver: {
        type: Number,
    },
    occurrenceDate: {
        type: Date,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Driver", OccurrenceSchema);
