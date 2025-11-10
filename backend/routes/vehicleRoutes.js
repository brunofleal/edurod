const router = require("express").Router();
const Vehicle = require("../models/VehicleModel");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");
const { getRequestAuthor } = require("../utils/requestAuthor");

// GET all vehicles with optional pagination
router.get("/", authenticateUser, async (req, res) => {
    try {
        let data;
        const limit = req.query.limit;
        const page = req.query.page;
        if (limit && page) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            data = await Vehicle.find().limit(parseInt(limit)).skip(skip);
            res.status(200).json({
                page: parseInt(page),
                limit: parseInt(limit),
                data,
            });
        } else {
            data = await Vehicle.find();
            res.status(200).json({ data });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// POST create vehicle
router.post("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty" });
        }
        const newVehicle = new Vehicle({ ...req.body });
        const data = await newVehicle.save();
        res.status(201).json({
            message: "Vehicle Added Successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// PUT update vehicle
router.put("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const data = await Vehicle.findByIdAndUpdate(vehicleId, req.body, {
            new: true,
        });
        if (!data) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json({
            message: "Vehicle updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// PATCH update vehicle
router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const newData = req.body;
        const oldData = await Vehicle.findById(vehicleId);
        if (!oldData) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };
        const data = await Vehicle.findByIdAndUpdate(vehicleId, updatedData, {
            new: true,
        });
        res.json({
            message: "Vehicle updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

// DELETE vehicle
router.delete("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const data = await Vehicle.findByIdAndDelete(vehicleId);
        if (!data) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json({
            message: "Vehicle deleted successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
