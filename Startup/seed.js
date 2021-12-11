const { saveAllMajorsSchedule } = require('../Services/SchedulesService');
const { Major } = require('../Models/Major');

module.exports = async function () {
  if (!(await Major.exists({ label: 'FIA1-01' }))) {
    await saveAllMajorsSchedule();
  }
};
