import IMatch from '../Interfaces/IMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';

type Query = {
  inProgress?: string;
};

type MatchDetails = {
  homeTeamGoals: number;
  awayTeamGoals: number;
};

export default class MatchService {
  private model: typeof SequelizeMatch;

  constructor() {
    this.model = SequelizeMatch;
  }

  public async getAllMatches(query: Query) {
    let teams = await this.model.findAll({
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    if (query.inProgress) {
      const condition = query.inProgress === 'true';
      teams = teams.filter((team) => team.dataValues.inProgress === condition);
    }
    return { status: 200, data: teams.map((team) => team.dataValues) };
  }

  public async finishMatch(id: number) {
    const match = await this.model.findByPk(id);
    if (!match) return { status: 404, data: { message: 'Match not found' } };
    if (!match.dataValues.inProgress) {
      return { status: 400, data: { message: 'Match already finished' } };
    }
    await match.update({ inProgress: false });
    return { status: 200, data: { message: 'Finished' } };
  }

  public async updateMatch(id: number, matchDetails: MatchDetails) {
    const { homeTeamGoals, awayTeamGoals } = matchDetails;
    const match = await this.model.findByPk(id);
    if (!match) return { status: 404, data: { message: 'Match not found' } };
    if (!match.dataValues.inProgress) {
      return { status: 400, data: { message: 'Match already finished' } };
    }
    await match.update({ homeTeamGoals, awayTeamGoals });
    return { status: 200, data: { message: 'Updated' } };
  }

  public async createMatch(matchDetails: IMatch) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = matchDetails;
    if (homeTeamId === awayTeamId) {
      return {
        status: 422,
        data: { message: 'It is not possible to create a match with two equal teams' } };
    }
    const homeTeam = await SequelizeTeam.findByPk(homeTeamId);
    const awayTeam = await SequelizeTeam.findByPk(awayTeamId);
    if (!homeTeam || !awayTeam) {
      return { status: 404, data: { message: 'There is no team with such id!' } };
    }
    const match = await this.model.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true });
    return { status: 201, data: match.dataValues };
  }
}
