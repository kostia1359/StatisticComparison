export enum EGameType {
  'HOME' = 'HOME',
  'AWAY' = 'AWAY',
}

export interface IStatisticEntry {
  rushing: {
    attempts: number | null;
    touchdowns: number | null;
    yards: number | null;
  };
  receiving: {
    receptions: number | null;
    yards: number | null;
  };
}

export interface ITeamStatistic {
  players: string[];
  totals: IStatisticEntry;
  type: EGameType;
}

export interface IConvertedData {
  players: Record<string, IStatisticEntry>;
  teams: Record<string, ITeamStatistic>;
  game: {
    id: string;
    attendance: string;
  };
}

export abstract class AbstractConverter<T> {
  data: T;
  constructor(data: T) {
    this.data = data;
  }

  convertData(): IConvertedData {
    throw new Error('Not implemented');
  }
}
