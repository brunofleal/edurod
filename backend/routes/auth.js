const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validations.js");
const User = require("../models/UserModel");
const authenticateUser = require("../middlewares/verifyToken");
const {
    authenticateUserWithAdminRole,
} = require("../middlewares/verifyAdminRole");

// Routers
router.post("/register", async (req, res) => {
    try {
        // Validation check
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Email uniqueness check
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res
                .status(400)
                .json({ message: "Email address already exists" });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Save user
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        });

        const newUser = await user.save();
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, email: newUser.email, name: newUser.name },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res
            .status(500)
            .json({ message: "Registration failed", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    // Validation check
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Email existance check
    const registeredUser = await User.findOne({ email: req.body.email });
    if (!registeredUser)
        return res.status(400).send("User with this email does not exist");

    // Check password
    const passwordMatch = bcrypt.compareSync(
        req.body.password,
        registeredUser.password
    );
    if (!passwordMatch)
        return res.status(400).send("Email or Password do not match");

    // Create and assign JWT
    const token = jwt.sign({ _id: registeredUser._id }, process.env.JWT_SECRET);
    res.header("auth-token", token).send(token);
});

router.post("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const newData = req.body;

        if (!newData || Object.keys(newData).length === 0) {
            return res
                .status(400)
                .json({ message: "Request body is required" });
        }

        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newData.password, salt);
            newData.password = hashedPassword;
        }

        if (newData.roles && newData.roles.includes(",")) {
            newData.roles = newData.roles.split(",");
        }

        const user = new User(newData);
        const newUser = await user.save();
        return res.status(201).json({
            message: "User created successfully",
            data: { id: newUser._id, email: newUser.email, name: newUser.name },
        });
    } catch (error) {
        console.error("User creation error:", error);
        return res
            .status(500)
            .json({ message: "Failed to create user", error: error.message });
    }
});

router.patch("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const productId = req.params.id;
        const newData = req.body;

        const oldData = await User.findById(productId).select("-password");

        if (!oldData) {
            return res.status(404).json({ message: "User not found" });
        }

        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newData.password, salt);
            newData.password = hashedPassword;
        }

        const updatedData = {
            ...oldData.toObject(),
            ...newData,
        };

        const data = await User.findByIdAndUpdate(productId, updatedData, {
            new: true,
        }).select("-password");

        return res.status(200).json({
            message: "User updated successfully",
            data,
        });
    } catch (err) {
        console.error("Update user error:", err);
        return res
            .status(500)
            .json({ message: "An error occurred", error: err.message });
    }
});

router.delete("/:id", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId).select(
            "-password"
        );

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return res
            .status(500)
            .json({ message: "An error occurred", error: error.message });
    }
});

router.get("/", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ data: users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
