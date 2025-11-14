const router = require("express").Router();
const OccurrenceCategory = require("../models/OccurrenceCategory");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");
const { getRequestAuthor } = require("../utils/requestAuthor");
const { logAction } = require("../utils/logAction");

// GET all categories
router.get("/", authenticateUser, async (req, res) => {
    try {
        const data = await OccurrenceCategory.find();
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// POST create category
router.post("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }
        const newCategory = new OccurrenceCategory({ ...req.body });
        const data = await newCategory.save();
        await logAction(
            req,
            "CREATE_OCCURRENCE_CATEGORY",
            `OccurrenceCategory created: ${data._id}`
        );
        res.status(201).json({
            message: "OccurrenceCategory Added Successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// PUT update category
router.put("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = await OccurrenceCategory.findByIdAndUpdate(
            categoryId,
            req.body,
            {
                new: true,
            }
        );
        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceCategory not found" });
        }
        await logAction(
            req,
            "UPDATE_OCCURRENCE_CATEGORY",
            `OccurrenceCategory updated: ${categoryId}`
        );
        res.json({
            message: "OccurrenceCategory updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// PATCH update category
router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const newData = req.body;
        const oldData = await OccurrenceCategory.findById(categoryId);
        if (!oldData) {
            return res
                .status(404)
                .json({ message: "OccurrenceCategory not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };
        const data = await OccurrenceCategory.findByIdAndUpdate(
            categoryId,
            updatedData,
            {
                new: true,
            }
        );
        await logAction(
            req,
            "PATCH_OCCURRENCE_CATEGORY",
            `OccurrenceCategory patched: ${categoryId}`
        );
        res.json({
            message: "OccurrenceCategory updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// DELETE category
router.delete("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = await OccurrenceCategory.findByIdAndDelete(categoryId);
        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceCategory not found" });
        }
        await logAction(
            req,
            "DELETE_OCCURRENCE_CATEGORY",
            `OccurrenceCategory deleted: ${categoryId}`
        );
        res.json({
            message: "OccurrenceCategory deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
