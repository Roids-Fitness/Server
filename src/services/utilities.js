const Class = require("../models/class");

const checkForTimeOverlap = async (startTime, endTime) => {
    try {
        const overlapClass = await Class.findOne({
            $or: [
                { startTime: { $lte: endTime }, endTime: { $gte: startTime } },
                { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gt: startTime } }
            ]
        });

        return overlapClass ? true : false;
    } catch (error) {
        console.error("Error while checking for class overlap:\n" + error);
        throw new Error("Error while checking for class overlap");
    }
};

module.exports = {
    checkForTimeOverlap
};
