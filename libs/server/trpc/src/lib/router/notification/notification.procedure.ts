import { selectWithoutCredential } from './../user/user.selector';
import { procedure } from '../../trpc';
import { PrismaClient} from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();
 export const notificationEvent = new EventEmitter();

  export const onUserConnectProcedure = procedure.subscription(async(input) => {
  const temp : any = {...input};
  const userID : any= temp['rawInput'];
      //Finding user from DB
      const user = await prisma.user.findFirst({
        where : {
          id : parseInt(userID)
        },
        select : selectWithoutCredential
      });

  return observable<any>((emit:any) => {
    const onAdd = (data: any) => {
      emit.next(data);
    };
     if(user) notificationEvent.on(userID, onAdd);

    return () => {
      if(user) notificationEvent.off(userID, onAdd);
    };
  });
  });

