import { app } from './server';
import config from './utils/config';

process.on('uncaughtException', (e) => {
  console.error('UNCAUGHT_EXCEPTION', e);
});

process.on('unhandledRejection', (e) => {
  console.error('UNHANDLED_REJECTION', e);
});

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
