import type { IStatisticService, TGetDiscrepanciesParams, IDiscrepancies } from './types';

export class StatisticService implements IStatisticService {
  getDiscrepancies(params: TGetDiscrepanciesParams): IDiscrepancies[] {
    return [];
  }
}
