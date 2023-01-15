import * as zod from 'zod';
import { PrismaClient} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {  protectedProcedure } from '../../trpc';


const prisma = new PrismaClient();

// getContact Socket

export const addContactProcedure = protectedProcedure
.input(
  zod.object({
    user_id: zod.number(),
    contact_id: zod.number(),
  })
)
.mutation(async ({ ctx, input }) => {
  const { userPayload } = ctx;

  //Unauthorized
  if (!userPayload) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //on friend request updating contact table
  const addContact = await prisma.user.update({
    where: {
      id: input.user_id,
    },
    data: {
      contact:{
        create: {
          contact_id :input.contact_id,
          status : 'sent',
        },
      }
    }
  });

  const acceptContact = await prisma.user.update({
    where: {
      id : input.contact_id
    },
    data: {
      contact:{
        create: {
          contact_id :input.user_id,
          status : 'received',
        },
      }
    }
  })

  return {
    status : "SUCCESS",
    message : "Friend request sent successfully."
  };
});


export const acceptContactProcedure = protectedProcedure
.input(
  zod.object({
    user_id: zod.number(),
    contact_id: zod.number(),
  })
)
.mutation(async ({ ctx, input }) => {
  const { userPayload } = ctx;

  //Unauthorized
  if (!userPayload) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //on friend request updating contact table
  await prisma.user.update({
    where: {
      id: input.contact_id,
    },
    data: {
      contact:{
        updateMany: {
          where:{
            contact_id : input.user_id
          },
          data:{
            status : 'received',
          }
        },
      }
    }
  });

  await prisma.user.update({
    where: {
      id : input.user_id
    },
    data: {
      contact:{
        updateMany: {
          where:{
            contact_id : input.contact_id
          },
          data:{
            status : 'received',
          }
        },
      }
    }
  })

  return {
    status : "SUCCESS",
    message : "Friend request sent successfully."
  };
});
