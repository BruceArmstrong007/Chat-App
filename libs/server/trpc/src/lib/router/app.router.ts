import { authRouter } from './auth/auth.router';
import { router } from "../trpc";
import { userRouter } from './user/user.router';


export const appRouter =  router({
   auth: authRouter,
   user: userRouter
});



export type AppRouter = typeof appRouter;
