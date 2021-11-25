const express = require("express");

const { updateAllMajorsSchedule } = require("../Services/SchedulesService");

const { Major } = require("../Models/Major");
const { sentryLog } = require("../Utils");
const { SeverityTypes } = require("../Utils");

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const majors = await Major.find().select({ majorId: 1, label: 1 });
    res.status(200).json(majors);
  } catch (error) {
    sentryLog(error, SeverityTypes.Error);
    res.status(500).send({ error: "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const major = await Major.findOne(
      { majorId: req.params.id },
      "-_id schedule updatedOn"
    );
    if (!major) {
      sentryLog("major not found", SeverityTypes.Error);
      return res
        .status(404)
        .json({ status: "failure", message: "major not found" });
    }
    const { schedule, updatedOn } = major;
    return res.status(200).json({ schedule, updatedOn });
  } catch (error) {
    sentryLog(error, SeverityTypes.Error);
    return res.status(500).send({ error: "server error" });
  }
});

router.patch("/scrape-majors-schedule", async (req, res) => {
  try {
    res.status(200);
    await updateAllMajorsSchedule();
  } catch (e) {
    sentryLog(e.message, SeverityTypes.Error);
  }
});

module.exports = router;
