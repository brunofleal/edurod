const mongoose = require("mongoose");

const OccurrenceSourceSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OccurrenceSource", OccurrenceSourceSchema);
