import { router } from "../../trpc";
import { getUserProcedure, registerUserProcedure, updateUserProcedure, findUserProcedure, resetPasswordProcedure } from "./user.procedure";

export const userRouter = router({
   register : registerUserProcedure,
   getUser : getUserProcedure,
   updateUser : updateUserProcedure,
   findUser : findUserProcedure,
   resetPassword : resetPasswordProcedure
});
