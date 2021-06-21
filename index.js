const  express =  require('express');


const schedulesRoute = require('./Routes/schedules')
const scheduleService = require("./Services/SchedulesService")
require('./Startup/db')()


const app = express()
const port = process.env.PORT || 3000


app.use('/schedules',schedulesRoute)

// scheduleService.saveAllMajorsSchedule()

app.listen(port,() => console.log(`listening on port ${port}`))