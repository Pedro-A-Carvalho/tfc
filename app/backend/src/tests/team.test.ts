import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response, Request } from 'superagent';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { user, userFromDB } from './mocks/user.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams', () => {
  beforeEach(() => sinon.restore());
  it('should return status 200 and all teams', async () => {
    const teams = [
      { id: 1, teamName: 'team1' },
      { id: 2, teamName: 'team2' },
    ];
    const buildedTeams = [
      SequelizeTeam.build(teams[0]),
      SequelizeTeam.build(teams[1]),
    ];
    sinon.stub(SequelizeTeam, 'findAll').resolves(buildedTeams);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.eq(200);
    expect(response.body).to.have.length(2);
    expect(response.body).to.deep.equal(teams);
  });

  it('should return status 200 and team by id', async () => {
    const team = { id: 1, teamName: 'team1' };
    const buildedTeam = SequelizeTeam.build(team);
    sinon.stub(SequelizeTeam, 'findByPk').resolves(buildedTeam);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.eq(200);
    expect(response.body).to.deep.equal(team);
  });

  it('should return status 404 if team not found', async () => {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.eq(404);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Team not found');
  });
});
