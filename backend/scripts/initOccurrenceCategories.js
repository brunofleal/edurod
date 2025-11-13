const mongoose = require("mongoose");
const OccurrenceCategory = require("../models/OccurrenceCategor");
const categories = [
    { name: "Grave", points: 100 },
    { name: "Média", points: 50 },
    { name: "Leve", points: 30 },
];

async function init() {
    await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/edurod"
    );
    for (const cat of categories) {
        await OccurrenceCategory.updateOne(
            { name: cat.name },
            { $set: cat },
            { upsert: true }
        );
    }
    console.log("Occurrence categories initialized.");
    await mongoose.disconnect();
}

init();
