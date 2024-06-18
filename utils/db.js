import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`, { useUnifiedTopology: true });
    this.client.connect().then((client) => {
      this.db = client.db(dbName);
      this.usersCollection = this.db.collection('users');
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
