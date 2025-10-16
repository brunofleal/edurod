const router = require("express").Router();
const Driver = require("../models/DriverModel");
const Occurrence = require("../models/OccurrenceModel");
const SystemVariables = require("../models/SystemVariablesModel");

const authenticateUser = require("../middlewares/verifyToken");

router.get("/", authenticateUser, async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let monthsInPeriod = 1; // Default to 1 month
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            monthsInPeriod =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());
        }

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
        const drivers = await Driver.find({ inactive: { $ne: true } });
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

            const systemVariables = await SystemVariables.find();
            const pointsPerDriver =
                systemVariables && systemVariables[0]
                    ? systemVariables[0].pointsPerDriver
                    : 100;
            const points = Math.max(
                pointsPerDriver * monthsInPeriod +
                    occurrencesForDriver.reduce(
                        (acc, curr) => acc + curr.occurrenceType.points,
                        0
                    ),
                0
            );
            const maxPayAmoutPerDriver =
                (systemVariables && systemVariables[0]
                    ? systemVariables[0].maxPayAmoutPerDriver
                    : 300) * monthsInPeriod;

            const bonus = Math.min(
                maxPayAmoutPerDriver * monthsInPeriod,
                (points / (pointsPerDriver * monthsInPeriod)) *
                    maxPayAmoutPerDriver
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
                bonus,
            };
            data.push(driverReport);
        }
        data.sort((a, b) => {
            if (a.points === b.points) {
                return a.driver.name.localeCompare(b.driver.name);
            }
            return a.points > b.points ? 1 : -1;
        });
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred ", err: err });
    }
});

module.exports = router;
