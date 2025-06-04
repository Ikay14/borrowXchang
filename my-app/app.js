import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { errorHandler } from './src/middleware/error.middleware.js';
import { initializeDatabase } from './src/config/data.source.js';
import authRoutes from './src/routes/auth.routes.js'
import transactionRoutes  from './src/routes/transactions.js'
import notificationRoute from './src/routes/notification.route.js'
import { initializeSocket } from './src/services/socket.service.js';
import { createServer } from 'http';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Show-room API',
      version: '1.0',
      description: 'API Documentation',
    },
    servers: [{ url: `http://localhost:${port}/api/v1` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

try {
  await initializeDatabase();
  console.log('Database Connected');
} catch (error) {
  console.error('Error initializing:', error);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

const server = createServer(app);
const io = initializeSocket(server);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transaction', transactionRoutes)
app.use('/api/v1/notification', notificationRoute)

// error handler
app.use(errorHandler)

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`); 
});

export default app;
