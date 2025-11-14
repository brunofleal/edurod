const router = require("express").Router();
const ActionLog = require("../models/ActionLogModel");
const authenticateUser = require("../middlewares/verifyToken");

// GET all action logs, most recent first
router.get("/", authenticateUser, async (req, res) => {
    try {
        const logs = await ActionLog.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ data: logs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

module.exports = router;
