/* eslint-disable import/no-named-as-default */
import redisClient from '../../utils/redis';
import { expect } from '../setup';

describe('+ RedisClient utility', () => {
  before(function (done) {
    this.timeout(10000);
    redisClient.client.flushall((err, success) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('+ Client is alive', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('+ Stores and retrieves data correctly', () => new Promise((done) => {
    redisClient.set('testKey', 'testValue', 10);
    setTimeout(() => {
      redisClient.get('testKey')
        .then((value) => {
          expect(value).to.equal('testValue');
          done();
        })
        .catch((err) => done(err));
    }, 1000);
  }));

  it('+ Expires key after ttl', function () {
    return new Promise((done) => {
      this.timeout(15000);
      redisClient.set('expireKey', 'expireValue', 5);
      setTimeout(() => {
        redisClient.get('expireKey')
          .then((value) => {
            expect(value).to.equal(null);
            done();
          })
          .catch((err) => done(err));
      }, 6000);
    });
  });
});
