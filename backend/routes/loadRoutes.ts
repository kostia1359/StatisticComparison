import type Koa from 'koa';
import { healthRouter } from './health/health.route';
import { statisticRouter } from './statistic/statistic.route';

export const loadRoutes = (app: Koa) => {
  const routers = [healthRouter, statisticRouter];

  routers.map((route) => {
    app.use(route.routes()).use(route.allowedMethods());
  });
};
