const express = require('express');
const studentRoutes = require('./routes/student.routes');
const errorHandler = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require("../swagger.json");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

//swagger set up
app.use('/student-api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/auth', authRoutes);
app.use('/api', studentRoutes);

app.use(errorHandler);

module.exports = app;
