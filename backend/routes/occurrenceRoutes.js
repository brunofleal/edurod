const router = require("express").Router();
const Occurrence = require("../models/OccurrenceModel");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
    authenticateUserWithOpenerRole,
    authenticateUserWithCloserOpenerRole,
} = require("../middlewares/verifyAdminRole");
const { getRequestAuthor } = require("../utils/requestAuthor");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const limit = req.query.limit || 100000;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Build date filter
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.creationDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (startDate) {
            dateFilter.creationDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.creationDate = { $lte: new Date(endDate) };
        }

        const data = await Occurrence.find(dateFilter)
            .limit(limit)
            .skip(skip)
            .populate("occurrenceType")
            .populate("driver")
            .populate("line")
            .populate("createdBy", "-password")
            .populate("modifiedBy", "-password")
            .sort({ occurrenceDate: -1 });
        res.status(200).json({ page: page, limit: limit, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.post("/", authenticateUserWithOpenerRole, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }
        let user = await getRequestAuthor(req);

        const newOccurrence = new Occurrence({ ...req.body, createdBy: user });

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

router.put("/:id", authenticateUserWithCloserOpenerRole, async (req, res) => {
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

router.patch("/:id", authenticateUserWithCloserOpenerRole, async (req, res) => {
    try {
        const productId = req.params.id;
        const newData = req.body;
        const oldData = await Occurrence.findById(productId);

        if (!oldData) {
            return res.status(404).json({ message: "Occurrence not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };

        const data = await Occurrence.findByIdAndUpdate(
            productId,
            updatedData,
            {
                new: true,
            }
        );

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
