import { IDiscrepancies } from '../discrepancies/types';

interface IGetDiscrepanciesByTeamParams {
  teamId: string;
}

interface IGetDiscrepanciesByPlayerParams {
  playerId: string;
}

interface IGetDiscrepanciesByGameParams {
  gameId: string;
}

type TGetDiscrepanciesParams =
  | IGetDiscrepanciesByTeamParams
  | IGetDiscrepanciesByPlayerParams
  | IGetDiscrepanciesByGameParams
  | {};

interface IStatisticService {
  getDiscrepancies(params: TGetDiscrepanciesParams): IDiscrepancies | null;
}

export type {
  IStatisticService,
  TGetDiscrepanciesParams,
  IGetDiscrepanciesByTeamParams,
  IGetDiscrepanciesByPlayerParams,
  IGetDiscrepanciesByGameParams,
};
