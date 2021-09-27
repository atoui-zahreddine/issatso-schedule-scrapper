const scheduler = require("node-schedule");
const config =require('config')

const { saveAllMajorsSchedule } = require("../Services/SchedulesService");

module.exports = async () => {
  scheduler.scheduleJob(config.get("SCRAPING_CRON"), async function () {
    await saveAllMajorsSchedule();
  });
};
