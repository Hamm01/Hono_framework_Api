import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'
import { AuthorTable, BookTable } from '../db/schema.ts'
import { eq } from 'drizzle-orm'
import { apiKeyAuth, type ApiKeyEnv } from '../middleware/auth.ts'

const app = new Hono()

const createBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishDate: z.coerce.date().optional(),
  pageCount: z.number().int().positive().optional(),
  authorId: z.uuid()
})

export default app
