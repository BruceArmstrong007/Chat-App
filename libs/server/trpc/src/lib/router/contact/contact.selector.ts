import {Prisma} from '@prisma/client';

export const selectWithoutCredential = Prisma.validator<Prisma.ContactsSelect>()({
  id : true,
  user_id : true,
  contact_id : true,
  status : true,
  created_at : true,
  updated_at : true
})

