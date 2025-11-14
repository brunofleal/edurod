const ActionLog = require("../models/ActionLogModel");
const { getRequestAuthor } = require("./requestAuthor");

/**
 * Registers a new action performed by a user.
 * @param {object} req - The Express request object.
 * @param {string} action - The action performed.
 * @param {string} [details] - Optional details about the action.
 * @returns {Promise<void>}
 */
async function logAction(req, action, details = "") {
    try {
        const user = await getRequestAuthor(req);
        if (!user || !user._id) return;
        await ActionLog.create({ user: user._id, action, details });
    } catch (err) {
        // Optionally log error, but do not throw
        console.error("Failed to log action:", err);
    }
}

module.exports = { logAction };
