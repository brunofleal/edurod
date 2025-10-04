const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv/config"); // Environment variables

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");

const occurrenceRoutes = require("./routes/occurrenceRoutes");
const occurrenceTypesRoutes = require("./routes/occurrenceTypeRoutes");
const driverRoutes = require("./routes/driverRoutes");
const lineRoutes = require("./routes/lineRoutes");

const privateRoutes = require("./routes/privateRoutes");
const limiter = require("./middlewares/rateLimiter");

// Constants

// Middlewares
app.use(cors());
app.use(express.json());
app.use(limiter);
// -> Route Middlewares
app.use("/", homeRoutes);
app.use("/api/private", privateRoutes);
app.use("/api/user", authRoutes);

app.use("/api/occurrences", occurrenceRoutes);
app.use("/api/occurrenceTypes", occurrenceTypesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/lines", lineRoutes);

// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
    console.log("Connected to Database");
});

// Starting the server
app.listen(process.env.PORT, () => {
    console.log(`Application running at http://localhost:${process.env.PORT}/`);
});
