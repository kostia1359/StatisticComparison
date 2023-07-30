import Router from '@koa/router';
import { statisticController } from '../../controllers';

const statisticRouter = new Router();

statisticRouter.get('/discrepancies', statisticController.getDiscrepancies);

export { statisticRouter };
