import * as bcrypt from 'bcrypt';
import * as zod from 'zod';
import { PrismaClient} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { procedure, protectedProcedure } from '../../trpc';
import { selectWithoutCredential } from './user.selector';


const SALT_ROUNDS = 10;
const prisma = new PrismaClient();

export const registerUserProcedure = procedure
.input(
  zod.object({
    username : zod.string().min(8).max(15),
    password : zod.string().min(8).max(36),
    confirmPassword : zod.string().min(8).max(36)
  }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      throw new TRPCError({
        code : 'BAD_REQUEST',
        message : 'Password didnot match, Try again.'
      });
    }
  })
)
.mutation(async ({input})=>{
  //Hash the password
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

   //Finding user from DB
   const user = await prisma.user.findFirst({
    where : {
      username : input.username
    },
    select : selectWithoutCredential
  });

  if(user){
    throw new TRPCError({
      code : 'BAD_REQUEST',
      message : 'User already exist, Try a different username.'
    });
  }

  //Create user in DB and return it without password
  await prisma.user.create({
   data : {
    username : input.username,
    password : hashedPassword
    }
  });

  return { status : "SUCCESS", message : 'User registered successfully.'};
});

export const getUserProcedure = protectedProcedure
.query(async ({ctx})=> {
  const {userPayload} = ctx;

  if(!userPayload){
    throw new TRPCError({
      code : 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //Getting user from DB
  const user = await prisma.user.findFirst({
    where : {
      id : userPayload.id
    },
    select : selectWithoutCredential
  });

  //User not found
  if(!user){
    return { status : "ERROR", message : "User not found."};
  }
  const contact = user?.contact;
  const contacts = [];
  for(let i = 0; i < contact.length;i++){
    const cont = await prisma.user.findFirst({
      where:{
        id : contact[i]?.contact_id
      },
      select : {
        id : true,
        username : true,
        image : true
      }
    });
    contacts.push({
      ...cont,
      status : contact[i]?.status
    })

  }


  return {
    ...user,
    contact : contacts
  }
});

export const updateUserProcedure = protectedProcedure
.input(
  zod.object({
    username: zod.string().min(6).max(15),
    image: zod.string().optional(),
    bio: zod.string().optional(),
    id: zod.number(),
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


   //Finding user from DB
   const user = await prisma.user.findFirst({
    where : {
      username : input.username
    },
    select : selectWithoutCredential
  });

  if(user && user?.username !== input?.username){
    throw new TRPCError({
      code : 'BAD_REQUEST',
      message : 'User already exist, Try a different username.'
    });
  }


  //Updating user details in DB and getting user details without credentials
  const updatedUser = await prisma.user.update({
    where: {
      id: input.id,
    },
    data: {
      username: input.username,
      image: input.image,
      bio: input.bio,
    },
    select: selectWithoutCredential,
  });

  return { status : "SUCCESS", message : "Profile updated successfully."};
});


export const findUserProcedure = protectedProcedure
.input(
  zod.object({
    username : zod.string()
  })
)
.query(async ({ctx,input})=> {
  const {userPayload} = ctx;

  if(!userPayload){
    throw new TRPCError({
      code : 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //Getting user from DB
  const user = await prisma.user.findMany({
    where : {
      username : {
        contains : input.username
      }
    },
    select : selectWithoutCredential
  });

  return user;
});

export const resetPasswordProcedure = protectedProcedure
.input(
  zod.object({
    id : zod.number(),
    username : zod.string().min(8).max(15),
    password : zod.string().min(8).max(36),
    confirmPassword : zod.string().min(8).max(36)
  }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      throw new TRPCError({
        code : 'BAD_REQUEST',
        message : 'Password didnot match, Try again.'
      });
    }
  })
)
.mutation(async ({ctx,input})=>{

  const {userPayload} = ctx;

  if(!userPayload){
    throw new TRPCError({
      code : 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);


  //Create user in DB and return it without password
  await prisma.user.update({
    where : {
    id : input.id,
    },
   data : {
    password : hashedPassword
    }
  });

  return { status : "SUCCESS", message : 'User password updated successfully.'};
});
