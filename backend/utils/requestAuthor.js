const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getRequestAuthor = async (req) => {
    const token = req.header("auth-token");
    if (!token) {
        return null;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return null;
        }
        const user = await UserModel.findById(verified._id).all();
        return user;
    } catch (error) {
        return null;
    }
};

module.exports = { getRequestAuthor };
