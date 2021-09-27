const { Major } = require("../Models/Major");

const { sleep } = require("../Utils");
const { getAllMajors, getScheduleByMajorId } = require("./ScrapingService");

async function saveAllMajorsSchedule() {
  try {
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
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = { saveAllMajorsSchedule };
