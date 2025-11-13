const mongoose = require("mongoose");

const OccurrenceSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            unique: true,
        },
        occurrenceCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OccurrenceCategory",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OccurrenceType", OccurrenceSchema);
