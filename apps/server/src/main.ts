import * as express from 'express';
import * as path from 'path';
import Helmet  from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext,appRouter } from '@server/trpc';

import { applyWSSHandler } from '@trpc/server/adapters/ws';
import * as ws from 'ws';

const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});

const app = express();

const ROUTES = {
  ASSETS: '/assets',
  API: '/api',
};

app.use(Helmet());

app.use(ROUTES.ASSETS, express.static(path.join(__dirname, 'assets')));

app.use(cors({
  origin: [process.env.WEB_CLIENT_URL],
  allowedHeaders: "*",
  credentials: true
 }));


 app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", process.env.WEB_CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(cookieParser());


app.use(
  ROUTES.API,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/',async(req,res)=>{
  return res.send('Hello');
});

const port = process.env.port || process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
