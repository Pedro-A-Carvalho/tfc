import IMatch from './IMatch';

export default interface IMatchReturn extends IMatch{
  homeTeam: {
    teamName: string;
  };
  awayTeam: {
    teamName: string;
  };
}
