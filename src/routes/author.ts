import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'

const app = new Hono()

const authors = [
  {
    id: '1',
    name: 'jijlu',
    brithday: new Date()
  },
  {
    id: '2',
    name: 'kumar'
  }
]

const createAuthorSchema = z.object({
  name: z.string().min(1),
  birthday: z.coerce.date().optional()
})

app.get('/', c => {
  // Getting all the authors as json
  return c.json(authors)
})

app.get('/:id', c => {
  const id = c.req.param('id')
  const author = authors.find(c => c.id === id)
  // finding the author using an id an returning the author details
  if (author == null) {
    return c.json({ error: 'Author not exist' }, 404)
  }
  return c.json(author)
})

app.post('/', sValidator('json', createAuthorSchema), c => {
  const data = c.req.valid('json')
  // creating the new author using post request
  const author = { id: crypto.randomUUID(), ...data }
  authors.push(author)

  return c.json(author, 201) // 201 for succesfuly save the author
})

export default app
