import { errors } from '../../common/errors/errors';
import { ExternalConverterService } from '../converters/external-converter/external-converter.service';
import { SrConverterService } from '../converters/sr-converter/sr-converter.service';
import { IGame } from '../converters/types';
import { dataService } from '../data/data.service';
import { DiscrepancyService } from '../discrepancies/discrepancies.service';
import { IDiscrepancies, IDiscrepancy } from '../discrepancies/types';
import type {
  IGetDiscrepanciesByGameParams,
  IGetDiscrepanciesByPlayerParams,
  IGetDiscrepanciesByTeamParams,
  IStatisticService,
  TGetDiscrepanciesParams,
} from './types';

export class StatisticService implements IStatisticService {
  private createEmptyDiscrepancies(): IDiscrepancies {
    return {
      players: {},
      teams: {},
      game: {} as IGame,
    };
  }

  private getByTeamId(
    discrepancies: IDiscrepancies,
    params: IGetDiscrepanciesByTeamParams,
  ): IDiscrepancies {
    if (!discrepancies.teams[params.teamId]) {
      throw errors.discrepancyNotFound();
    }

    return {
      ...this.createEmptyDiscrepancies(),
      teams: {
        [params.teamId]: discrepancies.teams[params.teamId],
      },
    };
  }

  private getByGameId(
    discrepancies: IDiscrepancies,
    params: IGetDiscrepanciesByGameParams,
  ): IDiscrepancies {
    const gameId =
      (discrepancies.game as IGame)?.id ||
      (discrepancies.game as IDiscrepancy<IGame>).baseValue?.id;
    if (gameId !== params.gameId) {
      throw errors.discrepancyNotFound();
    }

    return {
      ...this.createEmptyDiscrepancies(),
      game: discrepancies.game,
    };
  }

  private getByPlayerId(
    discrepancies: IDiscrepancies,
    params: IGetDiscrepanciesByPlayerParams,
  ): IDiscrepancies {
    if (!discrepancies.players[params.playerId]) {
      throw errors.discrepancyNotFound();
    }

    return {
      ...this.createEmptyDiscrepancies(),
      players: {
        [params.playerId]: discrepancies.players[params.playerId],
      },
    };
  }

  getDiscrepancies(params: TGetDiscrepanciesParams): IDiscrepancies {
    const discrepanciesService = new DiscrepancyService();

    const { baseData, externalData } = dataService;
    const baseConverter = new SrConverterService(baseData);
    const externalConverter = new ExternalConverterService(externalData);

    const discrepancies = discrepanciesService.createDiscrepancies(
      baseConverter,
      externalConverter,
    );

    if ((params as IGetDiscrepanciesByTeamParams).teamId) {
      return this.getByTeamId(discrepancies, params as IGetDiscrepanciesByTeamParams);
    }

    if ((params as IGetDiscrepanciesByGameParams).gameId) {
      return this.getByGameId(discrepancies, params as IGetDiscrepanciesByGameParams);
    }

    if ((params as IGetDiscrepanciesByPlayerParams).playerId) {
      return this.getByPlayerId(discrepancies, params as IGetDiscrepanciesByPlayerParams);
    }

    return discrepancies;
  }
}
