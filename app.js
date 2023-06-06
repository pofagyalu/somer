require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

//connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
//routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const path = require('path');
app.set('trust proxy', 1);

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(helmet());
// app.use(cors());
app.use(xss());

// app.get('/', (req, res) => {
//   res.send('<h1> Somer API</h1><a href="/api-docs">Documentation</a>');
// });
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '/client/build/index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
