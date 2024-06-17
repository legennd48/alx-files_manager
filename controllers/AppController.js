import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  constructor() {
    this.redisClient = redisClient;
    this.dbClient = dbClient;
  }

  async getStatus(req, res) {
    const data = {
      redis: await this.redisClient.isAlive(),
      db: await this.dbClient.isAlive(),
    };
    res.status(200).json(data);
  }

  async getStats(req, res) {
    const data = {
      users: await this.dbClient.nbUsers(),
      files: await this.dbClient.nbFiles(),
    };
    res.status(200).json(data);
  }
}

module.exports = new AppController();
