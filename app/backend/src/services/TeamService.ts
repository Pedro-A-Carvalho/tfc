import { ServiceResponse } from '../types/ServiceResponse';
import SequelizeTeam from '../database/models/SequelizeTeam';
import ITeam from '../Interfaces/ITeam';

export default class TeamService {
  private model: typeof SequelizeTeam;

  constructor() {
    this.model = SequelizeTeam;
  }

  public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.model.findAll();
    return { status: 200, data: teams.map((team) => team.dataValues) };
  }

  public async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.model.findByPk(id);
    if (!team) return { status: 404, data: { message: 'Team not found' } };
    return { status: 200, data: team.dataValues };
  }
}
