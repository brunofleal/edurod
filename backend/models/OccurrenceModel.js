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
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
        },
        line: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Line",
        },
        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OccurrenceSource",
        },
        isResolved: {
            type: Boolean,
            default: false,
        },
        isValid: {
            type: Boolean,
            default: true,
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
