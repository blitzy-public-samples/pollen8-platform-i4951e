import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import inviteRouter from './routes/invites';
import industryRouter from './routes/industries';
import interestRouter from './routes/interests';
import connectionRouter from './routes/connections';
import networkValueRouter from './routes/networkValue';
import industryNetworkRouter from './routes/industryNetworks';
import postRouter from './routes/posts';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';

function createApp(): express.Application {
  // Create a new Express application
  const app = express();

  // Configure CORS middleware
  app.use(cors());

  // Set up Helmet for security headers
  app.use(helmet());

  // Configure Morgan for request logging
  app.use(morgan('combined'));

  // Set up JSON and URL-encoded body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiting middleware
  app.use(rateLimiter);

  // Mount API routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/invites', inviteRouter);
  app.use('/api/industries', industryRouter);
  app.use('/api/interests', interestRouter);
  app.use('/api/connections', connectionRouter);
  app.use('/api/network-value', networkValueRouter);
  app.use('/api/industry-networks', industryNetworkRouter);
  app.use('/api/posts', postRouter);

  // Set up 404 Not Found handler
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Apply global error handling middleware
  app.use(errorHandler);

  return app;
}

const app = createApp();

export { app };