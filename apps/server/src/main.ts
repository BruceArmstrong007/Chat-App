import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext,appRouter } from '@server/trpc';

const app = express();

const ROUTES = {
  ASSETS: '/assets',
  API: '/api',
};


app.use(ROUTES.ASSETS, express.static(path.join(__dirname, 'assets')));

app.use(cors({ credentials: true, origin: process.env.WEB_CLIENT_URL }));
app.use(cookieParser());

app.use(
  ROUTES.API,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);


const port = process.env.port || process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
