import { Hono } from 'hono'
import z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { db } from '../db/db.ts'
import { UserTable } from '../db/schema.ts'
import { hashPassword } from '../lib/encrypt.ts'

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

export default app
