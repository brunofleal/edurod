const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        roles: {
            type: [String],
            default: [],
            validate: {
                validator: function (v) {
                    return Array.isArray(v);
                },
                message: "Roles must be an array",
            },
        },
    },
    { timestamps: true }
);

// Pre-save hook to ensure roles is always an array
UserSchema.pre("save", function (next) {
    if (this.roles && !Array.isArray(this.roles)) {
        if (typeof this.roles === "string") {
            this.roles = this.roles.split(",").map((role) => role.trim());
        } else {
            this.roles = [];
        }
    } else if (!this.roles || this.roles.length === 0) {
        this.roles = [];
    }
    next();
});

module.exports = mongoose.model("User", UserSchema);
