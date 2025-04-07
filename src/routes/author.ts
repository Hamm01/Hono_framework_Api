import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'
import { AuthorTable } from '../db/schema.ts'
import { eq } from 'drizzle-orm'
import { apiKeyAuth, type ApiKeyEnv } from '../middleware/auth.ts'

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
// we are creating the set of protected routes that will all use the same middle ware apikeyAuth
//By this all the creating , updating and deleting of author
// will only be done , if user is logged in, and we are getting the x-api-key so then we can create, delete or update author
const protectedApp = new Hono<ApiKeyEnv>()
protectedApp.use(apiKeyAuth)

protectedApp.post('/', sValidator('json', createAuthorSchema), async c => {
  const data = c.req.valid('json')
  const [author] = await db.insert(AuthorTable).values(data).returning()
  // Inserting the author in DB
  return c.json(author, 201) // 201 for sucessfully entry
})

const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  birthday: z.coerce.date().nullable().optional()
})

protectedApp.put('/:id', sValidator('json', updateAuthorSchema), async c => {
  const id = c.req.param('id')
  const data = c.req.valid('json')

  // updating the author details
  const [author] = await db
    .update(AuthorTable)
    .set(data)
    .where(eq(AuthorTable.id, id))
    .returning()
  // updating the author details in db
  if (author == null) {
    return c.json({ error: 'Author not exist' }, 404)
  }

  return c.json(author)
})

protectedApp.delete('/:id', async c => {
  const id = c.req.param('id')

  //Deleting the author record from the db
  await db.delete(AuthorTable).where(eq(AuthorTable.id, id))

  return c.body(null, 204) // 204 for sucessfull opreation
})

app.route('/', protectedApp)
export default app
