
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sendResponse } from './middlewares/responseHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { initDB } from './config/initDB.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(sendResponse);

const swaggerDocument = YAML.load('./swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', userRoutes);
app.use(errorHandler);

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

const startServer = async () => {
  await initDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};
startServer();

