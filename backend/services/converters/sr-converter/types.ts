export interface IRushingTotals {
  attempts: number;
  touchdowns: number;
  yards: number;
}

export interface IReceivingTotals {
  receptions: number;
  yards: number;
}

export interface IRushingGamePlayer {
  id: string;
  attempts: number;
  touchdowns: number;
  yards: number;
}

export interface IReceivingGamePlayer {
  id: string;
  receptions: number;
  yards: number;
}

export interface ITeam {
  id: string;
  rushing: {
    totals: IRushingTotals;
    players: IRushingGamePlayer[];
  };
  receiving: {
    totals: IReceivingTotals;
    players: IReceivingGamePlayer[];
  };
}

export interface IGame {
  id: string;
  attendance: number;
}

export interface ISourceData {
  sourceId: string;
  game: IGame;
  statistics: {
    home: ITeam;
    away: ITeam;
  };
}
