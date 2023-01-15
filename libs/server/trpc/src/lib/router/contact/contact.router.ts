import { router } from "../../trpc";
import { addContactProcedure, acceptContactProcedure, deleteContactProcedure } from "./contact.procedure";

export const contactRouter = router({
   friendRequest : addContactProcedure,
   acceptRequest : acceptContactProcedure,
   deleteFriend : deleteContactProcedure
});
