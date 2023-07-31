import deepEqual from 'deep-equal';

import type { IDiscrepancies, IDiscrepancy, IDiscrepancyService } from './types';
import { IAbstractConverter, IGame } from '../converters/types';
import { errors } from '../../common/errors/errors';

export class DiscrepancyService implements IDiscrepancyService {
  private createDiscrepancy<T>(baseValue: T | null, externalValue: T | null): IDiscrepancy<T> {
    if (!baseValue) {
      return {
        baseValue: null,
        externalValue,
      };
    }

    if (!externalValue) {
      return {
        baseValue,
        externalValue: null,
      };
    }

    return {
      baseValue,
      externalValue,
    };
  }

  private getGameDiscrepancy(baseGame: IGame, externalGame: IGame): Pick<IDiscrepancies, 'game'> {
    if (!deepEqual(baseGame, externalGame)) {
      return {
        game: this.createDiscrepancy(baseGame, externalGame),
      };
    }

    return { game: baseGame };
  }

  createDiscrepancies(
    baseConverter: IAbstractConverter,
    externalConverter: IAbstractConverter,
  ): IDiscrepancies {
    try {
      const baseData = baseConverter.convertData();
      const externalData = externalConverter.convertData();

      const discrepancy = {
        ...this.getGameDiscrepancy(baseData.game, externalData.game),
        teams: {},
        players: {},
      };

      Object.entries(baseData.teams).forEach(([teamId, baseTeamStatistic]) => {
        const externalTeamStatistic = externalData.teams[teamId];

        if (!deepEqual(externalTeamStatistic, baseTeamStatistic)) {
          discrepancy.teams = {
            ...discrepancy.teams,
            [teamId]: this.createDiscrepancy(baseTeamStatistic, externalTeamStatistic),
          };
        } else {
          discrepancy.teams = {
            ...discrepancy.teams,
            [teamId]: baseTeamStatistic,
          };
        }
      });

      Object.entries(externalData.teams).forEach(([teamId, externalTeamStatistic]) => {
        if (!baseData.teams[teamId]) {
          discrepancy.teams = {
            ...discrepancy.teams,
            [teamId]: this.createDiscrepancy(null, externalTeamStatistic),
          };
        }
      });

      Object.entries(baseData.players).forEach(([playerId, basePlayerStatistic]) => {
        const externalPlayerStatistic = externalData.players[playerId];

        if (!deepEqual(externalPlayerStatistic, basePlayerStatistic)) {
          discrepancy.players = {
            ...discrepancy.players,
            [playerId]: this.createDiscrepancy(basePlayerStatistic, externalPlayerStatistic),
          };
        } else {
          discrepancy.players = {
            ...discrepancy.players,
            [playerId]: basePlayerStatistic,
          };
        }
      });

      Object.entries(externalData.players).forEach(([playerId, externalPlayerStatistic]) => {
        if (!baseData.players[playerId]) {
          discrepancy.players = {
            ...discrepancy.players,
            [playerId]: this.createDiscrepancy(null, externalPlayerStatistic),
          };
        }
      });

      return discrepancy as IDiscrepancies;
    } catch (e) {
      throw errors.errorCreatingDiscrepancies();
    }
  }
}
