import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'
import { AuthorTable } from '../db/schemas.ts'

const app = new Hono()

app.get('/', async c => {
  const authors = await db.query.AuthorTable.findMany()
  //getting all the authors list from author table in database
  return c.json(authors)
})

app.get('/:id', async c => {
  const id = c.req.param('id')
  const author = await db.query.AuthorTable.findFirst({ where: { id: id } })
  // finding the author using an id in the db query
  if (author == null) {
    return c.json({ error: 'Author not exist' }, 404)
  }
  return c.json(author)
})

const createAuthorSchema = z.object({
  name: z.string().min(1),
  birthday: z.coerce.date().optional()
})

app.post('/', sValidator('json', createAuthorSchema), async c => {
  const data = c.req.valid('json')
  const author = await db.insert(AuthorTable).values(data).returning()
  // Inserting the author in DB
  return c.json(author, 201) // 201 for sucessfully entry
})

export default app
