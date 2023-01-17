import { authRouter } from './auth/auth.router';
import { router } from "../trpc";
import { userRouter } from './user/user.router';
import { contactRouter } from './contact/contact.router';
import { chatsRouter } from './chats/chats.router';
import { notificationRouter } from './notification/notification.router';


export const appRouter =  router({
   auth: authRouter,
   user: userRouter,
   contact : contactRouter,
   chats : chatsRouter,
   notification : notificationRouter
});



export type AppRouter = typeof appRouter;
