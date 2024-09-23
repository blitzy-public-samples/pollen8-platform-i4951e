import { app } from './app';
import { sequelize } from './config/database';
import { redisClient } from './config/redis';
import { connectToMongoDB } from './config/mongodb';
import { PORT } from './config/constants';
import { logger } from './utils/logger';

async function startServer(): Promise<void> {
  try {
    // Authenticate and sync Sequelize models with the database
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('Connected to PostgreSQL database');

    // Connect to Redis
    await redisClient.connect();
    logger.info('Connected to Redis');

    // Connect to MongoDB
    await connectToMongoDB();
    logger.info('Connected to MongoDB');

    // Start the HTTP server and listen on the specified PORT
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await gracefulShutdown();
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await gracefulShutdown();
});

async function gracefulShutdown(): Promise<void> {
  try {
    // Close the HTTP server
    await new Promise<void>((resolve) => {
      app.listen().close(() => {
        logger.info('HTTP server closed');
        resolve();
      });
    });

    // Close database connections
    await sequelize.close();
    logger.info('PostgreSQL connection closed');

    await redisClient.quit();
    logger.info('Redis connection closed');

    // Close MongoDB connection (assuming connectToMongoDB returns a client)
    const mongoClient = await connectToMongoDB();
    await mongoClient.close();
    logger.info('MongoDB connection closed');

    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}