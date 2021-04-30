const {sleep} = require('../Utils')
const {getAllMajors,getScheduleByMajorId} = require('./ScrapingService')



async function getAllSchedules() {
    let majors = await getAllMajors()
    const schedules = []
    for (let major of majors) {
        const schedule = await getScheduleByMajorId(major.id)
        schedules.push({...major,schedule})
        await sleep(1000)
    }
    return schedules
}



module.exports.getScheduleByMajorId = getScheduleByMajorId