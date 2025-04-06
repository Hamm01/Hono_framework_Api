import { createMiddleware } from 'hono/factory'
import { ApiKeyTable, type UserTable } from '../db/schema.ts'
import { hashApiKey } from '../lib/encrypt.ts'
import { db } from '../db/db.ts'

type ApiKeyEnv = {
  Variables: {
    apiKeyUser: Pick<typeof UserTable.$inferSelect, 'id' | 'role' | 'email'>
  }
}
export const apiKeyAuth = createMiddleware<ApiKeyEnv>(async (c, next) => {
  const key = c.req.header('X-API-Key')
  if (key == null || key.trim() === '') {
    return c.json({ error: 'Missing API Key' }, 401)
  }
  const keyHash = await hashApiKey(key)
  const apiKey = await db.query.ApiKeyTable.findFirst({ where: { keyHash } })
  if (apiKey == null) {
    return c.json({ error: 'Invalid API Key' }, 401)
  }
  const user = await db.query.UserTable.findFirst({
    where: { id: apiKey.userId },
    columns: { id: true, role: true, email: true }
  })

  if (user == null) {
    return c.json({ error: 'Invalid key' }, 401)
  }

  c.set('apiKeyUser', user)
  await next()
})
