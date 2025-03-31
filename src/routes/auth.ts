import { Hono } from 'hono'
import z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { db } from '../db/db.ts'
import { UserTable } from '../db/schema.ts'
import { hashPassword, verifyPassword } from '../lib/encrypt.ts'
import { sign } from 'hono/jwt'
import { env } from '../data/env.ts'

const JWT_EXPIRATION_SECONDS = 5 * 60
const app = new Hono()

const registerUserSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(8)
})
const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
})

app.post('/register', sValidator('json', registerUserSchema), async c => {
  const { email, password } = c.req.valid('json')
  const existing = await db.query.UserTable.findFirst({ where: { email } })
  if (existing != null) {
    return c.json({ error: 'Email already in use' }, 409) // data is conflicting
  }
  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(UserTable)
    .values({ email, passwordHash })
    .returning({ id: UserTable.id, email: UserTable.email })
  // Inserting the author in DB
  return c.json(user, 201) // 201 for sucessfully entry
})

app.post('/login', sValidator('json', loginSchema), async c => {
  const { email, password } = c.req.valid('json')
  const user = await db.query.UserTable.findFirst({ where: { email } })
  if (user == null) {
    return c.json({ error: 'Invalid email or password' }, 401) // failed authentication
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const now = Math.floor(Date.now() / 1000)
  const token = await sign(
    { exp: now + JWT_EXPIRATION_SECONDS, sub: user.id, email: user.email },
    env.JWT_SECRET
  )
  return c.json({ token })
})

export default app
