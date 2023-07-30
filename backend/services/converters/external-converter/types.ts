export interface IGamePlayer {
  id: string;
  rushAttempts?: number;
  rushTds?: number;
  rushYdsGained?: number;
  rec?: number;
  receivingYards?: number;
}

export interface ITeam {
  id: string;
  players: IGamePlayer[];
  rushAttempts: number;
  rushTds: number;
  rushYdsGained: number;
  rec: number;
  receivingYards: number;
}

export interface IGame {
  id: string;
  attendance: number;
  home: ITeam;
  away: ITeam;
}

export interface IExternalSourceData {
  sourceId: string;
  game: IGame;
}
