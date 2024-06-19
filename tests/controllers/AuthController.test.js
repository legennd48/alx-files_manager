import { expect, request } from '../setup';
import dbClient from '../../utils/db';

describe('authController', () => {
  before(async function () {
    this.timeout(10000);
    await dbClient.usersCollection().deleteMany({});
    await request.post('/users')
      .send({ email: 'user@example.com', password: 'password' });
  });

  describe('gET: /connect', () => {
    it('should login a user', () => new Promise((done) => {
      request.post('/connect')
        .send({ email: 'user@example.com', password: 'password' })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('token');
          done();
        });
    }));
  });

  describe('gET: /disconnect', () => {
    let token;

    before(async function () {
      this.timeout(10000);
      const res = await request.post('/connect')
        .send({ email: 'user@example.com', password: 'password' });
      token = res.body.token;
    });

    it('should logout a user', () => new Promise((done) => {
      request.get('/disconnect')
        .set('X-Token', token)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    }));
  });
});
