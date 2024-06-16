/* eslint-disable import/no-named-as-default */
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Controller class for handling application endpoints related to status and statistics.
 */
export default class AppController {
  /**
   * Handler for GET /status endpoint.
   * Checks the status of Redis and MongoDB.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   */
  static getStatus(req, res) {
    try {
      const redisAlive = redisClient.isAlive();
      const dbAlive = dbClient.isAlive();

      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Handler for GET /stats endpoint.
   * Retrieves the number of users and files from the database.
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   */
  static getStats(req, res) {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        res.status(200).json({ users: usersCount, files: filesCount });
      })
      .catch((error) => {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
}
