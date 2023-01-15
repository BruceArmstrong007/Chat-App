import { z } from 'zod';

export const tokenPayloadParser = z.object({
  id: z.number(),
  username: z.string()
});

export type TokenPayload = z.infer<typeof tokenPayloadParser>;
