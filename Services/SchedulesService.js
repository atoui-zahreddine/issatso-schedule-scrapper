const fs = require("fs/promises");
const { Major } = require("../Models/Major");

const { sleep } = require("../Utils");
const {
  getAllMajors,
  getScheduleByMajorId,
  getScheduleValidity,
} = require("./ScrapingService");

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
        console.log(`error while saving ${major.label} to db !!! ${e.message}`);
      }
    }
    console.log("saving schedules started ...");
  } catch (e) {
    console.log("error whiles saving majors :", e);
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
        console.log(`error while saving ${major.label} to db !!! ${e.message}`);
      }
    }
    console.log("updating schedules finished...");
  } catch (e) {
    console.log("error whiles updating majors :", e);
  }
}

const isScheduleUpdated = async () => {
  const { updatedOn } = await Major.findOne(
    { majorId: "MXZhMDMwMDg=" },
    "-_id updatedOn"
  );
  const [day, month, year] = await (await getScheduleValidity()).split("-");

  const scheduleValidFrom = new Date([month, +day + 1, year].join(" "));
  return scheduleValidFrom > updatedOn;
};

module.exports = {
  updateAllMajorsSchedule,
  saveAllMajorsSchedule,
  isScheduleUpdated,
};
