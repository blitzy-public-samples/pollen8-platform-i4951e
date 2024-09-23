import { Sequelize, SequelizeOptions } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from './constants';

function createSequelizeInstance(): Sequelize {
  // Create Sequelize options object with database credentials and configuration
  const sequelizeOptions: SequelizeOptions = {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    timezone: 'UTC'
  };

  // Initialize Sequelize instance with database name, username, password, and options
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, sequelizeOptions);

  // Return the configured Sequelize instance
  return sequelize;
}

// Create and export the Sequelize instance
export const sequelize = createSequelizeInstance();

// Implement graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
});

// Error handling for database connection failures
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });