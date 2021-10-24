const scheduler = require("node-schedule");
const config = require("config");

const {
  updateAllMajorsSchedule,
  isScheduleUpdated,
} = require("../Services/SchedulesService");

module.exports = async () => {
  console.log("SCRAPING day :", config.get("SCRAPING_CRON"));
  scheduler.scheduleJob(config.get("SCRAPING_CRON"), async function () {
    try {
      await updateAllMajorsSchedule();
    } catch (error) {
      console.log(error);
    }
  });
};
