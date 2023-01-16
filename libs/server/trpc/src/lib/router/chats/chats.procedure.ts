import { procedure } from './../../trpc';
import { PrismaClient} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as zod from 'zod';
import {  protectedProcedure } from '../../trpc';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();
const ee = new EventEmitter();

  export const onChatProcedure = procedure.subscription(async(input) => {
  const temp : any = {...input};
  const roomID : any= temp['rawInput'];
  return observable<any>((emit) => {
    const onAdd = (data: any) => {
      // emit data to client
      emit.next(data);
    };

     if(roomID) ee.on(roomID, onAdd);

    return () => {
      if(roomID) ee.off(roomID, onAdd);
    };
  });
  });

export const chatProcedure = protectedProcedure
.input(
  zod.object({
    id: zod.string(),
    from : zod.number(),
    to : zod.number(),
    message: zod.string().min(1),
  }),
)
.mutation(async ({ ctx, input }) => {
  const {userPayload} = ctx;

  if(!userPayload){
    throw new TRPCError({
      code : 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }
  await prisma.messages.create({
    data:{
      from : input.from,
      to : input.to,
      message : input.message
    }
  })
  // emiting to specific room id
  ee.emit(input?.id, input);
  return input;
})


export const getChatProcedure = protectedProcedure
.input(
  zod.object({
    user_id : zod.number(),
    contact_id : zod.number(),
  }),
)
.query(async ({ctx,input})=> {
  const {userPayload} = ctx;

  if(!userPayload){
    throw new TRPCError({
      code : 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  const messages = await prisma.messages.findMany({
    where:{
      OR : [
        {
          from: {
            equals : input.user_id
          },
          to: {
            equals : input.contact_id
          }
      },
      {
        from: {
          equals : input.contact_id
        },
        to: {
          equals : input.user_id
        }
      }
    ]
    },
  });

  return messages;
});
