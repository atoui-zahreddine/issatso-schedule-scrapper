const  express =  require('express');
const schedulesRoute = require('./Routes/schedules')

const app = express()
const port = process.env.PORT || 3000


app.use('/schedules',schedulesRoute)

app.listen(port,() => console.log(`listening on port ${port}`))