const {Major} = require('../Models/Major')

const {sleep} = require('../Utils')
const {getAllMajors,getScheduleByMajorId} = require('./ScrapingService')



async function saveAllMajorsSchedule() {
    let majors = await getAllMajors()
    for (let major of majors) {
        try {
            const schedule = await getScheduleByMajorId(major.id)
            const savedMajor = new Major({
                majorId:major.id,
                label:major.label,
                schedule
            })
            await Major.findOneAndUpdate({majorId:major.id},savedMajor,{upsert:true,useFindAndModify:false})
            console.log(`major ${major.label} saved successfully .`)
            await sleep(1000)
        }catch (e) {
            console.log(`error while saving ${major.label} to db !!!`+e)
        }
    }
}


module.exports.saveAllMajorsSchedule = saveAllMajorsSchedule