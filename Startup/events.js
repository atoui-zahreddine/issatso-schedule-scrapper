const scheduler = require("node-schedule");
const {saveAllMajorsSchedule} = require("../Services/SchedulesService")
module.exports = () => {
  scheduler.scheduleJob("59 23 * * 5", async function () {
    await saveAllMajorsSchedule()
  });
};
