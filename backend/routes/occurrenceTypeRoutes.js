const router = require("express").Router();
const OccurrenceType = require("../models/OccurrenceTypeModel");
const authenticateUser = require("./verifyToken");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const limit = req.query.limit || 200;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const returnOccurrenceTypes = await OccurrenceType.find()
            .limit(limit)
            .skip(skip);
        res.status(200).json({
            page: page,
            limit: limit,
            returnOccurrenceTypes,
        });
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

        const newOccurrenceType = new OccurrenceType({ ...req.body });

        const addOccurrenceType = await newOccurrenceType.save();
        res.status(201).json({
            message: "OccurrenceType Added Successfully",
            addedOccurrenceType: addOccurrenceType,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedOccurrenceType = await OccurrenceType.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );

        if (!updatedOccurrenceType) {
            return res
                .status(404)
                .json({ message: "OccurrenceType not found" });
        }

        res.json({
            message: "OccurrenceType updated successfully",
            updatedOccurrenceType,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedOccurrenceType = await OccurrenceType.findByIdAndDelete(
            productId
        );

        if (!deletedOccurrenceType) {
            return res
                .status(404)
                .json({ message: "OccurrenceType not found" });
        }

        res.json({
            message: "OccurrenceType deleted successfully",
            deletedOccurrenceType,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
