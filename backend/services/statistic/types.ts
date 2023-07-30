interface IDiscrepancies {}

interface IGetDiscrepanciesParams {
  page: number;
  limit: number;
}

interface IGetDiscrepanciesByTeamParams extends IGetDiscrepanciesParams {
  teamId: string;
}

interface IGetDiscrepanciesByPlayerParams extends IGetDiscrepanciesParams {
  playerId: string;
}

interface IGetDiscrepanciesByGameParams extends IGetDiscrepanciesParams {
  homeTeamId: string;
}

type TGetDiscrepanciesParams =
  | IGetDiscrepanciesParams
  | IGetDiscrepanciesByTeamParams
  | IGetDiscrepanciesByPlayerParams
  | IGetDiscrepanciesByGameParams;

interface IStatisticService {
  getDiscrepancies(params: TGetDiscrepanciesParams): IDiscrepancies[];
}

export type { IStatisticService, TGetDiscrepanciesParams, IDiscrepancies };
