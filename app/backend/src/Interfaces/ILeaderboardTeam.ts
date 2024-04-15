import IMatch from './IMatch';

export default interface ILeaderboardTeam {
  id: number;
  teamName: string;
  homeMatches: IMatch[];
  awayMatches: IMatch[];
}
