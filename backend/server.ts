import Router from '@koa/router';
import Koa from 'koa';
import { loadRoutes } from './routes/loadRoutes';

const app = new Koa();

loadRoutes(app);

export { app };
