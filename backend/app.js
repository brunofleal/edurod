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
const errorHandler = require("./middlewares/errorHandler");

// Constants

// Debug logging
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("DB_URL:", process.env.DB_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Middlewares
app.use(
    cors({
        origin: true, // Allow any origin
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
    })
);
app.use(express.json());
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Request body:", JSON.stringify(req.body, null, 2));
    }
    next();
});

// -> Route Middlewares
app.use("/", homeRoutes);
app.use("/api/user", authRoutes);

app.use("/api/occurrences", occurrenceRoutes);
app.use("/api/occurrenceTypes", occurrenceTypesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/driversReport", driverReportRoutes);
app.use("/api/lines", lineRoutes);

app.use("/api/systemVariables", systemVariablesRoutes);

// Global error handling middleware (must be AFTER all routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ message: "Route not found" });
});

// Connect to Database
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected to Database successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Mongoose error handling
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
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
