const router = require("express").Router();
const Occurrence = require("../models/OccurrenceModel");
const authenticateUser = require("../middlewares/verifyToken");
const authenticateUserWithAdminRole = require("../middlewares/verifyAdminRole");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const limit = req.query.limit || 100000;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const data = await Occurrence.find().limit(limit).skip(skip);
        res.status(200).json({ page: page, limit: limit, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.post("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }

        const newOccurrence = new Occurrence({ ...req.body });

        const data = await newOccurrence.save();
        res.status(201).json({
            message: "Occurrence Added Successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.put("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const productId = req.params.id;

        const data = await Occurrence.findByIdAndUpdate(productId, req.body, {
            new: true,
        });

        if (!data) {
            return res.status(404).json({ message: "Occurrence not found" });
        }

        res.json({
            message: "Occurrence updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.delete("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const productId = req.params.id;
        const data = await Occurrence.findByIdAndDelete(productId);

        if (!data) {
            return res.status(404).json({ message: "Occurrence not found" });
        }

        res.json({
            message: "Occurrence deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
