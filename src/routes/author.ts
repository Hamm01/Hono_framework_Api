import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from '../db/db.ts'

const app = new Hono()

app.get('/', async c => {
  const authors = await db.query.AuthorTable.findMany()
  //getting all the authors list from authortable in database
  return c.json(authors)
})

export default app
