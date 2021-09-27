const scheduler = require("node-schedule");
const config =require('config')

const {updateAllMajorsSchedule } = require("../Services/SchedulesService");

module.exports = async () => {
  scheduler.scheduleJob(config.get("SCRAPING_CRON"), async function () {
    await updateAllMajorsSchedule();
  });
};
