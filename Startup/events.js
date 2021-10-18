const scheduler = require('node-schedule');
const config = require('config');

const {
  updateAllMajorsSchedule,
  isScheduleUpdated,
} = require('../Services/SchedulesService');

module.exports = async () => {
  scheduler.scheduleJob(config.get('SCRAPING_CRON'), async function () {
    try {
      const isScheduleUpdated = await isScheduleUpdated();
      if (isScheduleUpdated) {
        console.log('updating schedules ... ');
        await updateAllMajorsSchedule();
        console.log('schedules updated.');
      }
    } catch (error) {
      console.log(error);
    }
  });
};
