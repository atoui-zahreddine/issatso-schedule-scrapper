const  express =  require('express');

const majorsRoute = require('./Routes/majors')
const port = process.env.PORT || 3000

const app = express()

require("./Startup")(app)

app.use('/api/v1/majors',majorsRoute)

app.listen(port,() => console.log(`listening on port ${port}`))