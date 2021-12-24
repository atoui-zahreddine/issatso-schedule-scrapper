const express = require('express');
const { Major } = require('../Models/Major');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Major.find();
  if (result) {
    let classrooms = new Set();
    for (let item of result) {
      const { schedule } = item._doc;
      Object.keys(schedule[1]).forEach(day => {
        Object.keys(schedule[1][day]).forEach(session => {
          schedule[1][day][session].forEach(item => {
            if (item.classroom && item.classroom !== 'A distance') {
              classrooms.add(item.classroom);
            }
          });
        });
      });
    }
    res.send(Array.from(classrooms).sort());
  } else {
    res.send('No schedule found');
  }
});

module.exports = router;
