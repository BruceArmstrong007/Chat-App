import {Prisma} from '@prisma/client';

export const selectWithoutCredential = Prisma.validator<Prisma.UserSelect>()({
  username: true,
  bio: true,
  image: true,
  id: true,
  password: false,
  contact: false,
})

