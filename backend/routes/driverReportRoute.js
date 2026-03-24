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
            const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
            monthsInPeriod = Math.max(Math.round(diffInDays / 28), 1);
        }

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.occurrenceDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (startDate) {
            dateFilter.occurrenceDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.occurrenceDate = { $lte: new Date(endDate) };
        }
        const drivers = await Driver.find({ inactive: { $ne: true } });
        const data = [];
        for (const driver of drivers) {
            const driverFilter = { driver: driver._id };
            const occurrencesForDriver = await Occurrence.find({
                ...dateFilter,
                ...driverFilter,
            }).populate({
                path: "occurrenceType",
                populate: { path: "occurrenceCategory" },
            });

            const validOccurrencesForDriver = occurrencesForDriver.filter(
                (occurrence) => occurrence.isValid !== false,
            );

            const topOccurrence = validOccurrencesForDriver.sort((a, b) => {
                const aPoints =
                    a.occurrenceType?.occurrenceCategory?.points || 0;
                const bPoints =
                    b.occurrenceType?.occurrenceCategory?.points || 0;
                return aPoints > bPoints ? 1 : -1;
            })[0];

            const systemVariables = await SystemVariables.find();
            const pointsPerDriver =
                systemVariables && systemVariables[0]
                    ? systemVariables[0].pointsPerDriver
                    : 100;

            const points = Math.max(
                pointsPerDriver * monthsInPeriod +
                    validOccurrencesForDriver.reduce(
                        (acc, curr) =>
                            acc +
                            (curr.occurrenceType?.occurrenceCategory?.points ||
                                0),
                        0,
                    ),
                0,
            );
            const baseMaxPayPerDriver =
                systemVariables && systemVariables[0]
                    ? systemVariables[0].maxPayAmoutPerDriver
                    : 300;

            // If the driver has an admission date within the evaluated period,
            // ignore the first month (the one containing the admission date)
            let eligibleMonths = monthsInPeriod;
            let admittedDuringPeriod = false;
            if (startDate && endDate && driver.admissionDate) {
                const periodStart = new Date(startDate);
                const periodEnd = new Date(endDate);
                const admissionDate = new Date(driver.admissionDate);
                if (admissionDate >= periodStart) {
                    admittedDuringPeriod = true;
                    // Calculate how many full months (28-day periods) remain after admission
                    const diffInDays =
                        (periodEnd - admissionDate) / (1000 * 60 * 60 * 24);
                    eligibleMonths = Math.max(Math.round(diffInDays / 28), 0);
                }
            }

            const maxPayAmoutPerDriver = baseMaxPayPerDriver * eligibleMonths;

            const bonus = Math.min(
                maxPayAmoutPerDriver,
                (points / (pointsPerDriver * monthsInPeriod)) *
                    maxPayAmoutPerDriver,
            );

            const driverReport = {
                driver,
                totalOccurrences: validOccurrencesForDriver.length,
                totalUnresolvedOccurrences: validOccurrencesForDriver.filter(
                    (occurence) => occurence.isResolved == false,
                ).length,
                topOccurrence: topOccurrence
                    ? topOccurrence.occurrenceType
                    : null,
                points,
                bonus,
                ...(admittedDuringPeriod
                    ? {
                          tooltip: `Motorista admitido durante o período de premiação(${new Date(driver.admissionDate).toLocaleDateString("pt-BR")})`,
                      }
                    : {}),
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
