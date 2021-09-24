const  express =  require('express');


const majorsRoute = require('./Routes/majors')
require('./Startup/db')()
require('./Startup/events')()

const app = express()
const port = process.env.PORT || 3000


app.use('/api/v1/majors',majorsRoute)




app.listen(port,() => console.log(`listening on port ${port}`))