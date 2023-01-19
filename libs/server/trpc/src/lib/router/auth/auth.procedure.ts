import { protectedProcedure } from './../../trpc';
import * as zod from 'zod';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { PrismaClient, User } from '@prisma/client';
import { procedure } from "../../trpc";
import { TokenPayload } from '../../parser/token.parser';

const prisma = new PrismaClient();

export const loginProcedure = procedure
.input(zod.object({
  username : zod.string().min(8).max(15),
  password : zod.string().min(8).max(32)
}))
.query(async ({input,ctx})=>{
  //Finding user
  const user:any = await prisma.user.findFirst({
    where : {
      username : input.username
    }
  });

  //If user not found
  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message : 'Invalid Username/Password.'
    });
  }

  //Compare password
  const isEqual = await bcrypt.compare(input.password, user.password);

  //If password not equal
  if (!isEqual) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message : 'Invalid Username/Password.'
    });
  }

  //Generate jwt
  const payload: TokenPayload = { id: user.id, username: user.username};
  const token = jwt.sign(payload, 'SECRET', {
    expiresIn: 60 * 60 * 24,
  });

  //Generate and attach refresh token with response
  const refreshToken = jwt.sign({ id: user.id }, 'REFRESH_SECRET', { expiresIn: 60 * 60 * 24 });
  ctx.res.cookie('refreshToken', refreshToken, { secure:true, httpOnly: true });

  //Saving refresh token in DB
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  })

  //Returning token
  return { token };
});

export const logoutProcedure = protectedProcedure
.mutation(async ({ctx})=>{
  const {userPayload} = ctx;

  //UnAuthorized
  if(!userPayload){
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //Update refresh token in DB
  await prisma.user.update({
    where : {
      id : userPayload.id
    },
    data : {
      refreshToken : null
    }
  });

  //Update refresh token in response
  ctx.res.cookie('refreshToken','deleted',{secure : true, httpOnly:true,expires: new Date(0)})
  return {status : 'SUCCESS', message: "Logged out successfully."}
});

export const accessTokenProcedure = procedure
.query(async({ctx})=>{
  //Getting refresh token from cookies
  const refreshToken = ctx.req.cookies.refreshToken;

  if(!refreshToken){
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message : 'Session expired, login again.'
    });
  }

  //Verify refresh token and get ID
  const { id } = jwt.verify(refreshToken,'REFRESH_SECRET') as jwt.JwtPayload & { id: User['id'] }
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  //UnAuthorized
  if (!user || user.refreshToken !== refreshToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message : 'Unable to connect, login again.'
    });
  }

  //Generate new refresh token
  const newRefreshToken = jwt.sign({ id: user.id }, 'REFRESH_SECRET', { expiresIn: 60 * 60 * 24 });
  const payload: TokenPayload = { id: user.id, username: user.username };

  //Generate new jwt token
  const token = jwt.sign(payload, 'SECRET', {
    expiresIn: '120s',
  });

  //Update refresh token in DB
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  //Send new refresh token as cookie in response
  ctx.res.cookie('refreshToken', newRefreshToken, { secure: true, httpOnly: true });

  return {
    token,
  };
})

