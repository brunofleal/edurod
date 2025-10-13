const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            unique: true,
        },
        code: {
            type: Number,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Line", LineSchema);
