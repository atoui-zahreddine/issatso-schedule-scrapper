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

router.get("/classroom-schedule", async(req, res)=>{
  const {classroom} = req.body;
  const sessions = ["S1","S2","S3","S4","S5","S6"];
  const days =  ['1-Lundi','2-Mardi','3-Mercredi','4-Jeudi','5-Vendredi','6-Samedi'];
  const myObj = Object.fromEntries(days.map(key => [key, {}]));



  for(var day of days){
    console.log(`===${day}===`)
    for(var session of sessions){
      console.log(`==${session}==`)
       const majorLabel = await Major.find(
        {
          [`schedule.1.${day}.${session}.0.classroom`]: { $in: classroom }
        },
        `-_id label`
      );
      myObj[day][session] = majorLabel[0]
    }
  }
  res.status(200).json(myObj)
})

module.exports = router;
 