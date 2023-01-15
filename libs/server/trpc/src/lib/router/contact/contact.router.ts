import { router } from "../../trpc";
import { addContactProcedure, acceptContactProcedure } from "./contact.procedure";

export const contactRouter = router({
   friendRequest : addContactProcedure,
   acceptRequest : acceptContactProcedure,
});
