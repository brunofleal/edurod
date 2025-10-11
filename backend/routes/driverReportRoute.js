const router = require("express").Router();
const Driver = require("../models/DriverModel");
const Occurrence = require("../models/OccurrenceModel");
const authenticateUser = require("../middlewares/verifyToken");

const INITIAL_POINTS = 100;

router.get("/", authenticateUser, async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.creationDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (startDate) {
            dateFilter.creationDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.creationDate = { $lte: new Date(endDate) };
        }
        const drivers = await Driver.find();
        const data = [];
        for (const driver of drivers) {
            const driverFilter = { driver: driver._id };
            const occurrencesForDriver = await Occurrence.find({
                ...dateFilter,
                ...driverFilter,
            }).populate("occurrenceType");

            const topOccurrence = occurrencesForDriver.sort((a, b) =>
                a.occurrenceType.points > b.occurrenceType.points ? 1 : -1
            )[0];

            const points =
                INITIAL_POINTS +
                occurrencesForDriver.reduce(
                    (acc, curr) => acc + curr.occurrenceType.points,
                    0
                );

            const driverReport = {
                driver,
                totalOccurrences: occurrencesForDriver.length,
                totalUnresolvedOccurrences: occurrencesForDriver.filter(
                    (occurence) => occurence.isResolved == false
                ).length,
                topOccurrence: topOccurrence
                    ? topOccurrence.occurrenceType
                    : null,
                points,
            };
            data.push(driverReport);
        }
        data.sort((a, b) => (a.points > b.points ? 1 : -1));
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
