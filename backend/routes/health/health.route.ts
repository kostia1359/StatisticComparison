import Router from '@koa/router';

const healthRouter = new Router();

healthRouter.get('/health', (ctx) => {
  ctx.body = 'Hello world';
  ctx.status = 200;
});

export { healthRouter };
