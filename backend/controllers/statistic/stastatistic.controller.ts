import { Context } from 'koa';

class StatisticController {
  getDiscrepancies(ctx: Context) {
    try {
      ctx.body = 'TEST';
      ctx.status = 200;
    } catch (e) {
      console.log(e);
    }
  }
}

export const statisticController = new StatisticController();
