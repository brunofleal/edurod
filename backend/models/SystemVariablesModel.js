const mongoose = require("mongoose");

const SystemVariablesSchema = new mongoose.Schema(
    {
        pointsPerDriver: {
            type: Number,
            default: 100,
        },
        maxPayAmoutPerDriver: {
            type: Number,
            default: 300,
        },
        maintenanceMode: {
            type: Boolean,
            default: false,
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
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SystemVariables", SystemVariablesSchema);
