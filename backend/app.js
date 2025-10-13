const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv/config"); // Environment variables

// Configure Mongoose
mongoose.set("strictQuery", false);

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");

const occurrenceRoutes = require("./routes/occurrenceRoutes");
const occurrenceTypesRoutes = require("./routes/occurrenceTypeRoutes");
const driverRoutes = require("./routes/driverRoutes");
const driverReportRoutes = require("./routes/driverReportRoute");
const lineRoutes = require("./routes/lineRoutes");
const systemVariablesRoutes = require("./routes/systemVariablesRoute");

const limiter = require("./middlewares/rateLimiter");

// Constants

// Debug logging
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("DB_URL:", process.env.DB_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Middlewares
app.use(
    cors({
        origin: [
            "http://localhost",
            "http://localhost:80",
            "http://127.0.0.1:8000",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(limiter);
// -> Route Middlewares
app.use("/", homeRoutes);
app.use("/api/user", authRoutes);

app.use("/api/occurrences", occurrenceRoutes);
app.use("/api/occurrenceTypes", occurrenceTypesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/driversReport", driverReportRoutes);
app.use("/api/lines", lineRoutes);

app.use("/api/systemVariables", systemVariablesRoutes);

// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
    console.log("Connected to Database");
});

// Starting the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running at http://0.0.0.0:${PORT}/`);
    console.log(`Backend accessible at http://localhost:${PORT}/`);
});

server.on("error", (err) => {
    console.error("Server error:", err);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("Server closed");
    });
});
