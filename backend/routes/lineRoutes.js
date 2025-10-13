const router = require("express").Router();
const Line = require("../models/LineModel");
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

        const data = await Line.find().limit(limit).skip(skip);
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

        const newLine = new Line({ ...req.body });

        const data = await newLine.save();
        res.status(201).json({
            message: "Line Added Successfully",
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

        const data = await Line.findByIdAndUpdate(productId, req.body, {
            new: true,
        });

        if (!data) {
            return res.status(404).json({ message: "Line not found" });
        }

        res.json({
            message: "Line updated successfully",
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
        const oldData = await Line.findById(productId);

        if (!oldData) {
            return res.status(404).json({ message: "Line not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };

        const data = await Line.findByIdAndUpdate(productId, updatedData, {
            new: true,
        });

        res.json({
            message: "Line updated successfully",
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
        const data = await Line.findByIdAndDelete(productId);

        if (!data) {
            return res.status(404).json({ message: "Line not found" });
        }

        res.json({
            message: "Line deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
