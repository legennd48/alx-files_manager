/* eslint-disable import/no-named-as-default */
import { expect } from 'chai';
import dbClient from '../../utils/db';
import { request } from '../setup';

describe('appController', () => {
  beforeEach(async () => {
    jest.setTimeout(10000);
    const [usersCollection, filesCollection] = await Promise.all([
      dbClient.usersCollection(),
      dbClient.filesCollection(),
    ]);
    await Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})]);
  });

  describe('gET /status', () => {
    it('should return services are online', async () => {
      const response = await request.get('/status');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ redis: true, db: true });
    });

    // Ensure that each test has assertions
    it('should have assertions', async () => {
      expect.hasAssertions();
    });
  });

  describe('gET /stats', () => {
    it('should return correct statistics about db collections', async () => {
      const response = await request.get('/stats');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ users: 0, files: 0 });
    });

    // Example of multiple assertions in a test
    it('should return updated statistics after data insertion', async () => {
      jest.setTimeout(10000);
      const [usersCollection, filesCollection] = await Promise.all([
        dbClient.usersCollection(),
        dbClient.filesCollection(),
      ]);
      await Promise.all([
        usersCollection.insertMany([{ email: 'john@mail.com' }]),
        filesCollection.insertMany([
          { name: 'foo.txt', type: 'file' },
          { name: 'pic.png', type: 'image' },
        ]),
      ]);

      const response = await request.get('/stats');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ users: 1, files: 2 });
    });

    // Ensure that each test has assertions
    it('should have assertions', async () => {
      expect.hasAssertions();
    });
  });
});
