import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'

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

export default app
