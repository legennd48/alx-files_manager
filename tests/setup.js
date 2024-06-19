import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; // Adjust the path according to your app's location

chai.use(chaiHttp);

export const { expect } = chai;
export const request = chai.request(app).keepOpen();
