const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const hasOneOfRequiredRoles = (roles, requiredRoles) => {
    for (const role of roles) {
        if (requiredRoles.includes(role)) {
            return true;
        }
    }
    return false;
};

const authenticateUserWithAdminRole = async (req, res, next) => {
    const rolesWithAccess = ["admin"];
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (!token) {
            return res.status(401).send("Access denied");
        }
        const user = await UserModel.findById(verified._id);
        if (
            !user ||
            !user.roles ||
            !hasOneOfRequiredRoles(user.roles, rolesWithAccess)
        ) {
            return res.status(401).send("Access denied - no required role");
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error });
    }

    next();
};

const authenticateUserWithOpenerRole = async (req, res, next) => {
    const rolesWithAccess = ["admin", "opener"];
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (!token) {
            return res.status(401).send("Access denied");
        }
        const user = await UserModel.findById(verified._id);
        if (
            !user ||
            !user.roles ||
            !hasOneOfRequiredRoles(user.roles, rolesWithAccess)
        ) {
            return res.status(401).send("Access denied - no required role");
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error });
    }

    next();
};

const authenticateUserWithCloserRole = async (req, res, next) => {
    const rolesWithAccess = ["admin", "closer"];
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (!token) {
            return res.status(401).send("Access denied");
        }
        const user = await UserModel.findById(verified._id);
        if (
            !user ||
            !user.roles ||
            !hasOneOfRequiredRoles(user.roles, rolesWithAccess)
        ) {
            return res.status(401).send("Access denied - no required role");
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error });
    }

    next();
};

const authenticateUserWithCloserOpenerRole = async (req, res, next) => {
    const rolesWithAccess = ["admin", "opener", "closer"];
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (!token) {
            return res.status(401).send("Access denied");
        }
        const user = await UserModel.findById(verified._id);
        if (
            !user ||
            !user.roles ||
            !hasOneOfRequiredRoles(user.roles, rolesWithAccess)
        ) {
            return res.status(401).send("Access denied - no required role");
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error });
    }

    next();
};

module.exports = {
    authenticateUserWithAdminRole,
    authenticateUserWithCloserRole,
    authenticateUserWithOpenerRole,
    authenticateUserWithCloserOpenerRole,
};
