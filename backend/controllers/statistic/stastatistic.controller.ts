import { Context } from 'koa';
import { StatisticService } from '../../services/statistic/statistic.service';
import { TGetDiscrepanciesParams } from '../../services/statistic/types';
import { APIError } from '../../common/errors/ApiError';

const statisticService = new StatisticService();

class StatisticController {
  getDiscrepancies(ctx: Context) {
    const createGetDiscrepanciesParams = (): TGetDiscrepanciesParams => {
      if (ctx.headers['x-game-id']) {
        return {
          gameId: ctx.headers['x-game-id'],
        };
      }

      if (ctx.headers['x-team-id']) {
        return {
          teamId: ctx.headers['x-team-id'],
        };
      }

      if (ctx.headers['x-player-id']) {
        return {
          playerId: ctx.headers['x-player-id'],
        };
      }

      return {};
    };
    try {
      const params = createGetDiscrepanciesParams();

      ctx.body = statisticService.getDiscrepancies(params);
      ctx.status = 200;
    } catch (e) {
      if (e instanceof APIError) {
        ctx.status = e.status;
        ctx.body = e.message;
      } else {
        ctx.status = 500;
      }

      console.error(e);
    }
  }
}

export const statisticController = new StatisticController();
