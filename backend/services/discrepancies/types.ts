import { IAbstractConverter, IGame, IStatisticEntry, ITeamStatistic } from '../converters/types';

export interface IDiscrepancy<T> {
  baseValue: T | null;
  externalValue: T | null;
}

type TDisperancy<T> = T | IDiscrepancy<T>;

interface IDiscrepancies {
  players: Record<string, TDisperancy<IStatisticEntry>>;
  teams: Record<string, TDisperancy<ITeamStatistic>>;
  game: TDisperancy<IGame>;
}

interface IDiscrepancyService {
  createDiscrepancies(
    baseConverter: IAbstractConverter,
    extenalConerter: IAbstractConverter,
  ): IDiscrepancies;
}

export type { IDiscrepancyService, IDiscrepancies };
