import { createMiddleware } from 'hono/factory'
import { ApiKeyTable, type UserTable } from '../db/schema.ts'
import { hashApiKey } from '../lib/encrypt.ts'
import { db } from '../db/db.ts'

type ApiKeyEnv = {
  Variables: {
    apiKeyUser: Pick<typeof UserTable.$inferSelect, 'id' | 'role' | 'email'>
  }
}
