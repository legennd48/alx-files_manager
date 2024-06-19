import { expect, request } from '../setup';
import dbClient from '../../utils/db';

describe('fileController', () => {
  let token;
  let fileId;

  before(async function () {
    this.timeout(10000);
    await dbClient.usersCollection().deleteMany({});
    await dbClient.filesCollection().deleteMany({});
    await request.post('/users')
      .send({ email: 'user@example.com', password: 'password' });
    const res = await request.post('/connect')
      .send({ email: 'user@example.com', password: 'password' });
    token = res.body.token;
  });

  describe('pOST: /files', () => {
    it('should upload a file', () => new Promise((done) => {
      request.post('/files')
        .set('X-Token', token)
        .send({
          name: 'testfile',
          type: 'file',
          data: 'base64encodeddata',
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('id');
          fileId = res.body.id;
          done();
        });
    }));
  });

  describe('gET: /files/:id', () => {
    it('should get file info', () => new Promise((done) => {
      request.get(`/files/${fileId}`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('id');
          done();
        });
    }));
  });

  describe('gET: /files', () => {
    it('should get files with pagination', () => new Promise((done) => {
      request.get('/files')
        .set('X-Token', token)
        .query({ page: 0 })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('array');
          done();
        });
    }));
  });

  describe('pUT: /files/:id/publish', () => {
    it('should publish a file', () => new Promise((done) => {
      request.put(`/files/${fileId}/publish`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('isPublic', true);
          done();
        });
    }));
  });

  describe('pUT: /files/:id/unpublish', () => {
    it('should unpublish a file', () => new Promise((done) => {
      request.put(`/files/${fileId}/unpublish`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('isPublic', false);
          done();
        });
    }));
  });

  describe('gET: /files/:id/data', () => {
    it('should get file data', () => new Promise((done) => {
      request.get(`/files/${fileId}/data`)
        .set('X-Token', token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.header['content-type']).to.equal('application/octet-stream');
          done();
        });
    }));
  });
});
