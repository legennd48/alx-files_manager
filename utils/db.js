import { MongoClient } from 'mongodb';

/**
 * A class to manage the database client configuration.
 */
class DBClient {
  /**
   * Creates a new DBClient instance with configuration from environment variables.
   * Falls back to default values if environment variables are not set.
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if the MongoDB client is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Asynchronously returns the number of documents in the users collection.
   * @returns {Promise<number>} The number of documents in the users collection.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Asynchronously returns the number of documents in the files collection.
   * @returns {Promise<number>} The number of documents in the files collection.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

/**
 * An instance of DBClient.
 * @type {DBClient}
 */
const dbClient = new DBClient();
export default dbClient;
