const mongoose = require("mongoose");

const OccurrenceSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            unique: true,
        },
        points: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OccurrenceType", OccurrenceSchema);
