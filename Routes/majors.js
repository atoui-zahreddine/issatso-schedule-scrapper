const express = require('express')
 
const { updateAllMajorsSchedule } = require("../Services/SchedulesService");
const {Major}  =require("../Models/Major")

const router = express.Router()

router.get('/:id',async (req, res)=> {
    const major = await Major.findOne({majorId: req.params.id}, '-_id schedule');
    if(!major) {
        res.status(404).json({status: "failure", message:"major not found"})
    }
    res.send(major);
})

router.get('', async (req, res) => {
    res.json(await Major.find().select({majorId : 1,label:1}))
})

router.patch("/scrape-majors-schedule", (async (req,res) => {
  try {
      await updateAllMajorsSchedule()
      res.status(200)
  } catch (e) {
      console.log(e.message)
      res.status(500)
  }
}
))

module.exports=router