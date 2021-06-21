const express = require('express')
const scheduleScrapper =require('../Services/SchedulesService')
const {Major}  =require("../Models/Major")
const router = express.Router()

router.get('/:id',async (req, res)=> {
    res.send(await Major.findOne({majorId : req.params.id}).select({majorId : 1,label:1,schedule: 1 }))
})

module.exports=router