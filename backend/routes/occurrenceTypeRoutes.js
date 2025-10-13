const router = require("express").Router();
const OccurrenceType = require("../models/OccurrenceTypeModel");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");
const { getRequestAuthor } = require("../utils/requestAuthor");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const limit = req.query.limit || 100000;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const data = await OccurrenceType.find().limit(limit).skip(skip);
        res.status(200).json({
            page: page,
            limit: limit,
            data,
        });
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

        const newOccurrenceType = new OccurrenceType({ ...req.body });

        const data = await newOccurrenceType.save();
        res.status(201).json({
            message: "OccurrenceType Added Successfully",
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

        const data = await OccurrenceType.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );

        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceType not found" });
        }

        res.json({
            message: "OccurrenceType updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const productId = req.params.id;
        const newData = req.body;
        const oldData = await OccurrenceType.findById(productId);

        if (!oldData) {
            return res
                .status(404)
                .json({ message: "OccurrenceType not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };

        const data = await OccurrenceType.findByIdAndUpdate(
            productId,
            updatedData,
            {
                new: true,
            }
        );

        res.json({
            message: "OccurrenceType updated successfully",
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
        const data = await OccurrenceType.findByIdAndDelete(productId);

        if (!data) {
            return res
                .status(404)
                .json({ message: "OccurrenceType not found" });
        }

        res.json({
            message: "OccurrenceType deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
