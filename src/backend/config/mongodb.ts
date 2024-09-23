import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI, MONGODB_DB_NAME } from './constants';

let mongoClient: MongoClient | null = null;
let db: Db | null = null;

async function connectToMongoDB(): Promise<{ client: MongoClient; db: Db }> {
  try {
    // Create a new MongoClient instance with the MONGODB_URI
    const client = new MongoClient(MONGODB_URI);

    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // Get the database instance using MONGODB_DB_NAME
    const database = client.db(MONGODB_DB_NAME);

    // Assign the client and database to the module-level variables
    mongoClient = client;
    db = database;

    // Return an object containing the client and database instances
    return { client, db: database };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Function to close the MongoDB connection
async function closeMongoDB(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
}

// Export the mongoClient and db variables
export { mongoClient, db, connectToMongoDB, closeMongoDB };