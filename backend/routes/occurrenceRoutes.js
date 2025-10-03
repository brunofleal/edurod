const router = require("express").Router();
const Occurrence = require("../models/OccurrenceModel");
const authenticateUser = require("./verifyToken");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const limit = req.query.limit || 200;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const returnOccurrences = await Occurrence.find()
            .limit(limit)
            .skip(skip);
        res.status(200).json({ page: page, limit: limit, returnOccurrences });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.post("/", authenticateUser, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }

        const newOccurrence = new Occurrence({ ...req.body });

        const addOccurrence = await newOccurrence.save();
        res.status(201).json({
            message: "Occurrence Added Successfully",
            addedOccurrence: addOccurrence,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedOccurrence = await Occurrence.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );

        if (!updatedOccurrence) {
            return res.status(404).json({ message: "Occurrence not found" });
        }

        res.json({
            message: "Occurrence updated successfully",
            updatedOccurrence,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedOccurrence = await Occurrence.findByIdAndDelete(productId);

        if (!deletedOccurrence) {
            return res.status(404).json({ message: "Occurrence not found" });
        }

        res.json({
            message: "Occurrence deleted successfully",
            deletedOccurrence,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
