import { notificationEvent } from './../notification/notification.procedure';
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
  });

  notificationEvent.emit((input.contact_id).toString(),{
    type : "notification",
    category: "received",
    message : "You have received a friend request."
  });

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
            status : 'friend',
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
            status : 'friend',
          }
        },
      }
    }
  });



  notificationEvent.emit((input.contact_id).toString(),{
    type : "notification",
    category: "accepted",
    message : "Your friend request has been accepted."
  });

  return {
    status : "SUCCESS",
    message : "Friend accepted successfully."
  };
});



export const deleteContactProcedure = protectedProcedure
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

  // delete contact table
  await prisma.user.update({
    where: {
      id: input.contact_id,
    },
    data: {
      contact:{
        deleteMany: [{
          contact_id : input.user_id
        }]
      }
    }
  });

  await prisma.user.update({
    where: {
      id : input.user_id
    },
    data: {
      contact:{
        deleteMany: [{
          contact_id : input.contact_id
        }]
      }
    }
  });


  notificationEvent.emit((input.contact_id).toString(),{
    type : "notification",
    category: "removed",
    message : "User removed."
  });

  return {
    status : "SUCCESS",
    message : "User unfriend successfully."
  };
});
