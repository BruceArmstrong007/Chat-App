import { router } from "../../trpc";
import { onUserConnectProcedure } from "./notification.procedure";

export const notificationRouter = router({
  userConnect: onUserConnectProcedure,
});
