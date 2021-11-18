const express = require("express");

const {
  updateAllMajorsSchedule,
  isScheduleUpdated,
} = require("../Services/SchedulesService");

const { Major } = require("../Models/Major");

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const majors = await Major.find().select({ majorId: 1, label: 1 });
    res.status(200).json(majors);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "server error" });
  }
});

router.get("/is-updated", async (req, res) => {
  try {
    const isUpdated = await isScheduleUpdated();
    res.status(200).send({ isUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { schedule, updatedOn } = await Major.findOne(
      { majorId: req.params.id },
      "-_id schedule updatedOn"
    );
    if (!schedule) {
      res.status(404).json({ status: "failure", message: "major not found" });
    }
    res.status(200).json({ schedule, updatedOn });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "server error" });
  }
});

router.patch("/scrape-majors-schedule", async (req, res) => {
  res.status(200);
  try {
    await updateAllMajorsSchedule();
    console.log("schedules updated.");
  } catch (e) {
    console.log(e.message);
    res.status(500);
  }
});

module.exports = router;
