import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response, Request } from 'superagent';
import SequelizeUser from '../database/models/SequelizeUser';
import LoginService from '../services/LoginService';
import * as bcrypt from 'bcryptjs';
import { user, userFromDB } from './mocks/user.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login', () => {
  beforeEach(() => sinon.restore());
  it('should return status 200 and token if user in DB', async () => {
    sinon.stub(SequelizeUser, 'findOne').resolves(userFromDB);

    const response = await chai.request(app).post('/login').send(user);

    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    expect(typeof response.body.token).to.eq('string');
  });

  it('should return status 401 if user not in DB', async () => {
    const user = {
      email: 'asd@asd.com',
      password: '123456',
    }
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    const response = await chai.request(app).post('/login').send(user);

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Invalid email or password');
  });

  it('should return status 401 if email is in invalid format', async () => {
    const user = {
      email: 'asd',
      password: '123456',
    }

    const response = await chai.request(app).post('/login').send(user);

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Invalid email or password');
  });

  it('should return status 400 if password is empty', async () => {
    const user = {
      email: 'asd@asd.com',
      password: '',
    }

    const response = await chai.request(app).post('/login').send(user);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('All fields must be filled');
  });

  it('should return status 200 and role if user in DB', async () => {

    sinon.stub(SequelizeUser, 'findByPk').resolves(userFromDB);

    const { body } = await chai.request(app).post('/login').send(user);

    const response = await chai.request(app).get('/login/role').set({ authorization: 'Bearer: ' + body.token });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('role');
  });
});
