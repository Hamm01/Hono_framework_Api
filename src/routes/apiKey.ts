import { Hono } from 'hono'
import z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { db } from '../db/db.ts'
import { ApiKeyTable, UserTable } from '../db/schema.ts'
import { generateApiKey, hashPassword, verifyPassword } from '../lib/encrypt.ts'
import { jwt } from 'hono/jwt'
import { env } from '../data/env.ts'
import { and, eq } from 'drizzle-orm'

type JwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number }
  }
}
// Added new jwtenv type to access the payload as variable in endpoints
const app = new Hono<JwtEnv>()
const createKeySchema = z.object({
  name: z.string().min(1).max(255)
})

app.use(jwt({ secret: env.JWT_SECRET, alg: 'HS256' }))

app.get('/', async c => {
  const { sub: userId } = c.var.jwtPayload

  // This will list all the api keys that are linked to that particualar user, that userid we got from the jwt token we recieved
  const keys = await db.query.ApiKeyTable.findMany({
    where: { userId },
    columns: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true
    }
  })
  return c.json(keys)
})

app.post('/', sValidator('json', createKeySchema), async c => {
  const { sub: userId } = c.var.jwtPayload
  const { name } = await c.req.valid('json')
  const { hash, prefix, raw } = generateApiKey()

  // As basis of jwt token we get the user id and then genrated random api key with hash and prefix,
  //  that api-key will store in api key table for that particualr user, so that user may contains many api keys
  const [apiKey] = await db
    .insert(ApiKeyTable)
    .values({ name, userId, keyHash: hash, keyPrefix: prefix })
    .returning({ id: ApiKeyTable.id })

  return c.json({ key: raw, id: apiKey.id }, 201)
})

app.delete('/:id', sValidator('json', createKeySchema), async c => {
  const { sub: userId } = c.var.jwtPayload
  const id = c.req.param('id')
  // Deleting the api key for the userid
  await db
    .delete(ApiKeyTable)
    .where(and(eq(ApiKeyTable.id, id), eq(ApiKeyTable.userId, userId)))

  return c.body(null, 204)
})

export default app
