const router = require("express").Router();
const SystemVariables = require("../models/SystemVariablesModel");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");
const { getRequestAuthor } = require("../utils/requestAuthor");

router.get("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const data = await SystemVariables.find();

        res.status(200).json({ data });
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
        let user = await getRequestAuthor(req);

        const newSystemVariables = new SystemVariables({
            ...req.body,
            createdBy: user,
        });

        const data = await newSystemVariables.save();
        res.status(201).json({
            message: "SystemVariables Added Successfully",
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

        const data = await SystemVariables.findByIdAndUpdate(
            productId,
            req.body,
            {
                new: true,
            }
        );

        if (!data) {
            return res
                .status(404)
                .json({ message: "SystemVariables not found" });
        }

        res.json({
            message: "SystemVariables updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const oldData = await SystemVariables.findById(id);

        if (!oldData) {
            return res
                .status(404)
                .json({ message: "SystemVariables not found" });
        }
        let user = await getRequestAuthor(req);
        const updatedData = {
            ...oldData.toObject(),
            ...newData,
            modifiedBy: user,
        };

        const data = await SystemVariables.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        res.json({
            message: "SystemVariables updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
