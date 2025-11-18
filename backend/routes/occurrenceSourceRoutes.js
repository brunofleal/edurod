const router = require("express").Router();
const OccurrenceSource = require("../models/OccurrenceSourceModel");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");
const { logAction } = require("../utils/logAction");

// GET all occurrence sources
router.get("/", authenticateUser, async (req, res) => {
    try {
        const data = await OccurrenceSource.find();
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

// POST create occurrence source
router.post("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }
        const newOccurrenceSource = new OccurrenceSource({ ...req.body });
        const data = await newOccurrenceSource.save();
        await logAction(
            req,
            "CREATE_OCCURRENCE_SOURCE",
            `OccurrenceSource created: ${data._id}`
        );
        res.status(201).json({
            message: "OccurrenceSource Added Successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

// PUT update occurrence source
router.put("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const sourceId = req.params.id;
        const data = await OccurrenceSource.findByIdAndUpdate(
            sourceId,
            req.body,
            {
                new: true,
            }
        );
        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceSource not found" });
        }
        await logAction(
            req,
            "UPDATE_OCCURRENCE_SOURCE",
            `OccurrenceSource updated: ${sourceId}`
        );
        res.json({
            message: "OccurrenceSource updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

// PATCH update occurrence source
router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const sourceId = req.params.id;
        const newData = req.body;
        const oldData = await OccurrenceSource.findById(sourceId);
        if (!oldData) {
            return res
                .status(404)
                .json({ message: "OccurrenceSource not found" });
        }
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
        };
        const data = await OccurrenceSource.findByIdAndUpdate(
            sourceId,
            updatedData,
            {
                new: true,
            }
        );
        await logAction(
            req,
            "PATCH_OCCURRENCE_SOURCE",
            `OccurrenceSource patched: ${sourceId}`
        );
        res.json({
            message: "OccurrenceSource updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

// DELETE occurrence source
router.delete("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const sourceId = req.params.id;
        const data = await OccurrenceSource.findByIdAndDelete(sourceId);
        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceSource not found" });
        }
        await logAction(
            req,
            "DELETE_OCCURRENCE_SOURCE",
            `OccurrenceSource deleted: ${sourceId}`
        );
        res.json({
            message: "OccurrenceSource deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", err });
    }
});

module.exports = router;
