import IMatch from '../Interfaces/IMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';
import IMatchResults from '../Interfaces/IMatchResults';
import { ServiceResponse, SimpleServiceResponse } from '../types/ServiceResponse';

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

  public async getAllMatches(query: Query): Promise<ServiceResponse<IMatch[]>> {
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

  public async finishMatch(id: number): Promise<SimpleServiceResponse> {
    const match = await this.model.findByPk(id);
    if (!match) return { status: 404, data: { message: 'Match not found' } };
    if (!match.dataValues.inProgress) {
      return { status: 400, data: { message: 'Match already finished' } };
    }
    await match.update({ inProgress: false });
    return { status: 200, data: { message: 'Finished' } };
  }

  public async updateMatch(id: number, matchDetails: MatchDetails): Promise<SimpleServiceResponse> {
    const { homeTeamGoals, awayTeamGoals } = matchDetails;
    const match = await this.model.findByPk(id);
    if (!match) return { status: 404, data: { message: 'Match not found' } };
    if (!match.dataValues.inProgress) {
      return { status: 400, data: { message: 'Match already finished' } };
    }
    await match.update({ homeTeamGoals, awayTeamGoals });
    return { status: 200, data: { message: 'Updated' } };
  }

  public async createMatch(matchDetails: IMatch): Promise<ServiceResponse<IMatch>> {
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

  public static getMatchData(matches: IMatch[]):IMatchResults {
    let goalsFavor = 0; let goalsOwn = 0; let totalVictories = 0; let totalDraws = 0;
    let totalLosses = 0;
    matches.forEach((match) => {
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
      if (match.homeTeamGoals > match.awayTeamGoals) totalVictories += 1;
      else if (match.homeTeamGoals === match.awayTeamGoals) totalDraws += 1;
      else totalLosses += 1;
    });

    return {
      totalGames: matches.length, goalsFavor, goalsOwn, totalVictories, totalDraws, totalLosses,
    };
  }
}
