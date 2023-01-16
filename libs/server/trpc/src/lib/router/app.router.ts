import { authRouter } from './auth/auth.router';
import { router } from "../trpc";
import { userRouter } from './user/user.router';
import { contactRouter } from './contact/contact.router';
import { chatsRouter } from './chats/chats.router';


export const appRouter =  router({
   auth: authRouter,
   user: userRouter,
   contact : contactRouter,
   chats : chatsRouter
});



export type AppRouter = typeof appRouter;
