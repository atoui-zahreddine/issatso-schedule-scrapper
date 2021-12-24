const express = require('express');

const majorsRoute = require('./Routes/majors');
const classroomsRoute = require('./Routes/classrooms');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

require('./Startup')(app);

app.use('/api/v1/majors', majorsRoute);
app.use('/api/v1/classrooms', classroomsRoute);

require('./Middleware/sentry')(app);

app.listen(port, () => console.log(`listening on port ${port}`));
