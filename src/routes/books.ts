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

app.get('/:id', async c => {
  const id = c.req.param('id')
  const book = await db.query.BookTable.findFirst({
    where: { id },
    with: { author: true }
  })
  // finding the book using an id and along with the author information
  if (book == null) {
    return c.json({ error: 'Book not found' }, 404)
  }
  return c.json(book)
})

const protectedApp = new Hono<ApiKeyEnv>()
protectedApp.use(apiKeyAuth)

protectedApp.post('/', sValidator('json', createBookSchema), async c => {
  const { id: userId } = c.get('apiKeyUser')
  const data = c.req.valid('json')

  const author = await db.query.AuthorTable.findFirst({
    where: { id: data.authorId }
  })
  if (author == null) {
    return c.json({ error: 'Author not found' }, 404)
  }
  const [book] = await db
    .insert(BookTable)
    .values({ ...data, addedBy: userId })
    .returning()
  // Inserting the author in DB
  return c.json(book, 201) // 201 for sucessfully entry of book in db
})

protectedApp.put('/:id', sValidator('json', updateBookSchema), async c => {
  const id = c.req.param('id')
  const { id: userId, role } = c.get('apiKeyUser')
  const data = c.req.valid('json')

  if (data.authorId != null) {
    const author = await db.query.AuthorTable.findFirst({
      where: { id: data.authorId }
    })
    // checking the author id must exist and author is avalaible in db or not
    if (author == null) {
      return c.json({ error: 'Author not found' }, 404)
    }
  }
  const whereClause =
    role === 'admin'
      ? eq(BookTable.id, id)
      : and(eq(BookTable.id, id), eq(BookTable.addedBy, userId))
  // this clause to update book only by admin or user who uploaded that book
  const [book] = await db
    .update(BookTable)
    .set(data)
    .where(whereClause)
    .returning()

  if (book == null) {
    return c.json('Book Not found', 404)
  }

  return c.json(book)
})

protectedApp.delete('/:id', async c => {
  const id = c.req.param('id')
  const { id: userId, role } = c.get('apiKeyUser')

  const whereClause =
    role === 'admin'
      ? eq(BookTable.id, id)
      : and(eq(BookTable.id, id), eq(BookTable.addedBy, userId))
  // this clause to delete book only by admin or user who uploaded that book
  //Deleting the Book record from the bookTable in db
  await db.delete(BookTable).where(whereClause)

  return c.body(null, 204) // 204 for sucessfull opreation
})

app.route('/', protectedApp)
export default app
