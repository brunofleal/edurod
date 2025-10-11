const mongoose = require("mongoose");

const LineSchema = new mongoose.Schema(
    {
        description: {
            type: String,
        },
        code: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Line", LineSchema);
