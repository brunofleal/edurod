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
    // Validation check
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Email uniqueness check
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
        return res.status(400).send("Email address already exists");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Save user
    const user = User({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
    });

    try {
        const newUser = await user.save();
        res.send({ user: newUser._id });
    } catch (error) {
        res.send({ message: error });
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

router.post("/", async (req, res) => {
    const newData = req.body;
    try {
        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newData.password, salt);
            newData.password = hashedPassword;
        }
        if (newData.roles && newData.roles.includes(",")) {
            newData.roles = newData.roles.split(",");
        }

        const user = User(newData);
        const newUser = await user.save();
        res.send({ user: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

router.patch("/:id", async (req, res) => {
    const productId = req.params.id;
    const newData = req.body;
    try {
        const oldData = await User.findById(productId).select("-password");

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
        });
        res.json({
            message: "User updated successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
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

        res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", err: error });
    }
});

router.get("", authenticateUserWithAdminRole, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
