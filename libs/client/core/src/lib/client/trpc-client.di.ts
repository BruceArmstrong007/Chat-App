import { Router } from '@angular/router';
import { RequestHandlerService } from './../services/request-handler.service';
import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@server/trpc';
import { createTRPCProxyClient, httpLink, splitLink } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client';
import { injectConfig } from '../config/config.di';
import { injectToken } from './token.di';
import { MatSnackBar } from '@angular/material/snack-bar';
// create persistent WebSocket connection

const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('__TRPC_PROVIDER__');
export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: () => {
    const config = injectConfig();
    const token = injectToken();
    const wsClient = createWSClient({
      url: config.WS_URL,
    });
    const responseHandler = inject(RequestHandlerService);
    const snackBar = inject(MatSnackBar);
    const router = inject(Router);
    return createTRPCProxyClient<AppRouter>({
      links: [
         // call subscriptions through websockets and the rest over http
       splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false:
      httpLink({
        url: config.API_URL,
        async fetch(url, args) {
          const response = await fetch(url, { ...args, credentials: 'include' });
          if (!response.ok) {
            const json = await response.json();
            const error = json.error;
            const errorCode = (typeof error?.code == 'number') ?error?.data?.code : error?.code;
            if (error?.message === 'TOKEN_EXPIRED') {
              const refreshUrl = `${config.API_URL}/auth.accessToken?batch=1&input={}`;
              const refreshResponse = await fetch(refreshUrl, { credentials: 'include' });
              const refreshJson = await refreshResponse.json();
              const accessToken = refreshJson.result.data.token;
              token.setAccessToken(accessToken);
              return await fetch(url, {
                ...args,
                credentials: 'include',
                headers: {
                  ...args?.headers,
                  Authorization: accessToken,
                },
              });
            }
            if(errorCode === 'UNAUTHORIZED'){
              localStorage.clear();
              router.navigateByUrl('/');
            }
            const {message , options} = responseHandler.ErrorResponseHandler(errorCode,error?.message);
            console.log(message,options);
            snackBar.open(message,'Close', options);
          }
          return response;
        },
        headers() {
          return {
            Authorization: token.getAccessToken(),
          };
        },
      }),
    }),
      ],
    });
  },
});


