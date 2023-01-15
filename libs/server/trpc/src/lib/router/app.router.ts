import { authRouter } from './auth/auth.router';
import { router } from "../trpc";
import { userRouter } from './user/user.router';
import { contactRouter } from './contact/contact.router';


export const appRouter =  router({
   auth: authRouter,
   user: userRouter,
   contact : contactRouter
});



export type AppRouter = typeof appRouter;
