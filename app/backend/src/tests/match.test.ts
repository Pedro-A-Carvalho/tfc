import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response, Request } from 'superagent';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { user, userFromDB } from './mocks/user.mock';
import SequelizeTeam from '../database/models/SequelizeTeam';
import IMatchReturn from '../Interfaces/IMatchReturn';
import SequelizeUser from '../database/models/SequelizeUser';

chai.use(chaiHttp);

const { expect } = chai;

describe('Match', () => {
  beforeEach(() => sinon.restore());
  it('should return status 200 and all matches', async () => {
    const matches = [
      { 
        id: 1, 
        homeTeamId: 1, 
        homeTeamGoals: 1, 
        awayTeamId: 2, 
        awayTeamGoals: 2 , 
        inProgress: false,
        homeTeam: { teamName: 'team1' }, 
        awayTeam: { teamName: 'team2' }
      }, 
      { 
        id: 2, 
        homeTeamId: 2, 
        awayTeamId: 3, 
        homeTeamGoals: 2, 
        awayTeamGoals: 1 , 
        inProgress: true,
        homeTeam: { teamName: 'team2' }, 
        awayTeam: { teamName: 'team3' }
      },
    ];
    const buildedMatches = [
      {
        dataValues: { 
        id: 1, 
        homeTeamId: 1, 
        homeTeamGoals: 1, 
        awayTeamId: 2, 
        awayTeamGoals: 2 , 
        inProgress: false, 
        homeTeam: { teamName: 'team1' }, 
        awayTeam: { teamName: 'team2' }
        }
      },
      {
        dataValues:{ 
        id: 2, 
        homeTeamId: 2, 
        awayTeamId: 3, 
        homeTeamGoals: 2, 
        awayTeamGoals: 1 , 
        inProgress: true, 
        homeTeam: { teamName: 'team2' }, 
        awayTeam: { teamName: 'team3' }
        }
      }
    ]; 
    sinon.stub(SequelizeMatch, 'findAll').resolves(buildedMatches as any);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.eq(200);
    expect(response.body).to.have.length(2);
    expect(response.body).to.deep.equal(matches);
  });

  it('should return status 401 and message token not found', async () => {
    const response = await chai.request(app).patch('/matches/1/finish');
    // console.log(response);

    expect(response.status).to.eq(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eq('Token not found');
  });

  it('should return status 401 and message token must be a valid token', async () => {
    const response = await chai.request(app).patch('/matches/1/finish').set({ authorization: 'Bearer: ' });

    expect(response.status).to.eq(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eq('Token must be a valid token');
  });

  it('should return status 200 and message finished', async () => {
    const match = {
      id: 1,
      homeTeamId: 1,
      homeTeamGoals: 1,
      awayTeamId: 2,
      awayTeamGoals: 2,
      inProgress: true,
    };
    sinon.stub(SequelizeMatch, 'findByPk').resolves({ dataValues: match, update: function(obj:any): void {}} as any);
    // sinon.stub(SequelizeMatch.prototype, 'update').resolves();
    // sinon.stub(SequelizeUser, 'findByPk').resolves(userFromDB);

    const { body } = await chai.request(app).post('/login').send(user);
    const response = await chai.request(app).patch('/matches/1/finish').set({ authorization: 'Bearer: ' + body.token});

    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eq('Finished');
  });

  it('should return status 404 and message match not found', async () => {
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);

    const { body } = await chai.request(app).post('/login').send(user);
    const response = await chai.request(app).patch('/matches/1/finish').set({ authorization: 'Bearer: ' + body.token});

    expect(response.status).to.eq(404);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eq('Match not found');
  });

  it('should return status 400 and message match already finished', async () => {
    const match = {
      id: 1,
      homeTeamId: 1,
      homeTeamGoals: 1,
      awayTeamId: 2,
      awayTeamGoals: 2,
      inProgress: false,
    };
    sinon.stub(SequelizeMatch, 'findByPk').resolves({ dataValues: match, update: function(obj:any): void {}} as any);

    const { body } = await chai.request(app).post('/login').send(user);
    const response = await chai.request(app).patch('/matches/1/finish').set({ authorization: 'Bearer: ' + body.token});

    expect(response.status).to.eq(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eq('Match already finished');
  });

});
