const router = require("express").Router();
const Line = require("../models/LineModel");
const authenticateUser = require("./verifyToken");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const limit = req.query.limit || 200;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const returnLines = await Line.find().limit(limit).skip(skip);
        res.status(200).json({ page: page, limit: limit, returnLines });
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

        const newLine = new Line({ ...req.body });

        const addLine = await newLine.save();
        res.status(201).json({
            message: "Line Added Successfully",
            addedLine: addLine,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedLine = await Line.findByIdAndUpdate(productId, req.body, {
            new: true,
        });

        if (!updatedLine) {
            return res.status(404).json({ message: "Line not found" });
        }

        res.json({
            message: "Line updated successfully",
            updatedLine,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedLine = await Line.findByIdAndDelete(productId);

        if (!deletedLine) {
            return res.status(404).json({ message: "Line not found" });
        }

        res.json({
            message: "Line deleted successfully",
            deletedLine,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
