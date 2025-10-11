const mongoose = require("mongoose");

const OccurrenceSchema = new mongoose.Schema(
    {
        description: {
            type: String,
        },
        closingCommentary: {
            type: String,
        },
        occurrenceType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OccurrenceType",
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
        },
        line: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Line",
        },
        source: { type: String },
        isResolved: {
            type: Boolean,
            default: false,
        },
        occurrenceDate: {
            type: Date,
        },
        resolvedDate: {
            type: Date,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Occurrence", OccurrenceSchema);
