import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'
import { AuthorTable, BookTable } from '../db/schema.ts'
import { and, eq } from 'drizzle-orm'
import { apiKeyAuth, type ApiKeyEnv } from '../middleware/auth.ts'

const app = new Hono()

const createBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishDate: z.coerce.date().optional(),
  pageCount: z.number().int().positive().optional(),
  authorId: z.uuid()
})

const updateBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  publishDate: z.coerce.date().nullable().optional(),
  pageCount: z.number().int().positive().nullable().optional(),
  authorId: z.uuid().optional()
})

app.get('/', async c => {
  const books = await db.query.BookTable.findMany({ with: { author: true } })
  //getting all the book list from booktable along with author details
  return c.json(books)
})

export default app
