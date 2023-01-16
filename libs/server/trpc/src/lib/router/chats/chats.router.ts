import { chatProcedure, onChatProcedure, getChatProcedure } from './chats.procedure';
import { router } from "../../trpc";

export const chatsRouter = router({
  chat: chatProcedure,
  onChat : onChatProcedure,
  getChat : getChatProcedure
});
