const mongoose = require("mongoose");

const OccurrenceCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        points: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OccurrenceCategory", OccurrenceCategorySchema);
