import { Hono } from 'hono'
import z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { db } from '../db/db.ts'
import { UserTable } from '../db/schema.ts'
import { hashPassword, verifyPassword } from '../lib/encrypt.ts'
import { jwt } from 'hono/jwt'
import { env } from '../data/env.ts'

type JwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number }
  }
}
// Added new jwtenv type to access the payload as variable in endpoints
const app = new Hono<JwtEnv>()

app.use(jwt({ secret: env.JWT_SECRET, alg: 'HS256' }))

app.get('/', async c => {
  const { sub: userId } = c.var.jwtPayload

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

export default app
