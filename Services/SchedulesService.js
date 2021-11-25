const { Major } = require("../Models/Major");

const { sleep, sentryLog, SeverityTypes } = require("../Utils");
const { getAllMajors, getScheduleByMajorId } = require("./ScrapingService");

async function saveAllMajorsSchedule() {
  try {
    console.log("saving schedules started ...");
    let majors = await getAllMajors();

    for (let major of majors) {
      try {
        const schedule = await getScheduleByMajorId(major.id);
        const newMajor = new Major({
          majorId: major.id,
          schedule,
          label: major.label,
          updatedOn: new Date(),
        });
        await newMajor.save();
        console.log(`major ${major.label} saved successfully .`);
        await sleep(1000);
      } catch (e) {
        sentryLog(
          `error while saving ${major.label} to db !!! ${e.message}`,
          SeverityTypes.Error
        );
      }
    }
    console.log("saving schedules started ...");
  } catch (e) {
    sentryLog(`error whiles updating majors :`, SeverityTypes.Error);
  }
}

async function updateAllMajorsSchedule() {
  try {
    console.log("updating schedules started ...");
    let majors = await getAllMajors();

    for (let major of majors) {
      try {
        const schedule = await getScheduleByMajorId(major.id);
        await Major.findOneAndUpdate(
          { majorId: major.id },
          {
            $set: {
              schedule,
              label: major.label,
              updatedOn: new Date(),
            },
          },
          { upsert: true, useFindAndModify: false }
        );
        console.log(`major ${major.label} saved successfully .`);
        await sleep(1000);
      } catch (e) {
        sentryLog(
          `error while saving ${major.label} to db !!! ${e.message}`,
          SeverityTypes.Error
        );
      }
    }
    console.log("updating schedules finished...");
  } catch (e) {
    sentryLog(`error whiles updating majors :`, SeverityTypes.Error);
  }
}

module.exports = {
  updateAllMajorsSchedule,
  saveAllMajorsSchedule,
};
