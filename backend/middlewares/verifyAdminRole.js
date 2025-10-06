const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const authenticateUserWithAdminRole = async (req, res, next) => {
    const token = req.header("auth-token"); // For any authenticated request, need to pass auth-token header
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (!token) {
            return res.status(401).send("Access denied");
        }
        const user = await UserModel.findById(verified._id).all();
        if (!user || !user.roles || !user.roles.includes("admin")) {
            return res.status(401).send("Access denied - no required role");
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }

    next();
};

module.exports = authenticateUserWithAdminRole;
