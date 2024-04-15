import SequelizeMatch from '../database/models/SequelizeMatch';
import ILeaderboardTeam from '../Interfaces/ILeaderboardTeam';
import ILeaderboardTeamData from '../Interfaces/ILeaderboardTeamData';
import SequelizeTeam from '../database/models/SequelizeTeam';
import MatchService from './MatchService';
import { ServiceResponse } from '../types/ServiceResponse';
import orderByProperty from '../utils/orderByPropriety';

export default class LeaderboardService {
  private model: typeof SequelizeTeam;

  constructor() {
    this.model = SequelizeTeam;
  }

  public async getAllTeamsHome(): Promise<ServiceResponse<ILeaderboardTeamData[]>> {
    const teams = await this.model.findAll({
      include: [
        { model: SequelizeMatch, as: 'homeMatches', where: { inProgress: false } },
        // { model: SequelizeMatch, as: 'awayMatches', where: { inProgress: false } },
      ],
    });
    const tailoredTeams = teams
      .map((team) => LeaderboardService
        .getLeaderboardTeamData(team.dataValues as ILeaderboardTeam));
    const sortedTeams = tailoredTeams
      .sort(
        orderByProperty(['totalPoints', 'totalVictories', 'goalsBalance', 'goalsFavor'], false),
      );
    return { status: 200,
      data: sortedTeams };
  }

  public async getAllTeamsAway(): Promise<ServiceResponse<ILeaderboardTeamData[]>> {
    const teams = await this.model.findAll({
      include: [
        // { model: SequelizeMatch, as: 'homeMatches', where: { inProgress: false } },
        { model: SequelizeMatch, as: 'awayMatches', where: { inProgress: false } },
      ],
    });
    const tailoredTeams = teams
      .map((team) => LeaderboardService
        .getLeaderboardTeamData(team.dataValues as ILeaderboardTeam));
    const sortedTeams = tailoredTeams
      .sort(
        orderByProperty(['totalPoints', 'totalVictories', 'goalsBalance', 'goalsFavor'], false),
      );
    return { status: 200,
      data: sortedTeams };
  }

  public static getLeaderboardTeamData(team: ILeaderboardTeam): ILeaderboardTeamData {
    const resultsHome = MatchService.getMatchData(team.homeMatches || []);
    const resultsAway = MatchService.getMatchData(team.awayMatches || []);
    const pointsHome = resultsHome.totalVictories * 3 + resultsHome.totalDraws;
    const pointsAway = resultsAway.totalLosses * 3 + resultsAway.totalDraws;
    const goalsFavor = resultsHome.goalsFavor + resultsAway.goalsOwn;
    const goalsOwn = resultsHome.goalsOwn + resultsAway.goalsFavor;
    const eff = (pointsHome + pointsAway) / ((resultsHome.totalGames + resultsAway.totalGames) * 3);
    return { name: team.teamName,
      totalPoints: pointsHome + pointsAway,
      totalGames: resultsHome.totalGames + resultsAway.totalGames,
      totalVictories: resultsHome.totalVictories + resultsAway.totalLosses,
      totalDraws: resultsHome.totalDraws + resultsAway.totalDraws,
      totalLosses: resultsHome.totalLosses + resultsAway.totalVictories,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: parseFloat((eff * 100).toFixed(2)),
    };
  }

//   public async getTeamById(id: number) {
//     const team = await this.model.findByPk(id);
//     if (!team) return { status: 404, data: { message: 'Team not found' } };
//     return { status: 200, data: team.dataValues };
//   }
}
