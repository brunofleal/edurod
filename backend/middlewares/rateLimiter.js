const rateLimit = require("express-rate-limit");

const rateLimitMiddleware = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // 1000 requests per windowMs
    message: "Too many requests from this IP, please try again later",
});

module.exports = rateLimitMiddleware;
