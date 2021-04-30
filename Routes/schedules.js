const express = require('express')
const scheduleScrapper =require('../Services/SchedulesService')
const router = express.Router()

router.get('/:id',async (req, res)=> {
    res.send(await scheduleScrapper.getScheduleByMajorId(req.params.id))
})

module.exports=router