import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'

const app = new Hono()

const authors: { id: string; name: string; birthday?: Date | null }[] = [
  {
    id: '1',
    name: 'jijlu',
    birthday: new Date()
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
const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  birthday: z.coerce.date().nullable().optional()
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

  return c.json(author, 201) // 201 for sucessfully save the author
})

app.put('/:id', sValidator('json', updateAuthorSchema), c => {
  const id = c.req.param('id')
  const data = c.req.valid('json')
  // updating the author details
  let author = authors.find(c => c.id === id)
  if (author == null) {
    return c.json({ error: 'Author not exist' }, 404)
  }
  authors.map(c => {
    if (c.id === id) {
      if (data.name !== undefined) {
        c.name = data.name
      }
      if (data.birthday !== undefined) {
        c.birthday = data.birthday
      }
    }
    return c
  })
  // updating the author details, these are all in memory
  author = authors.find(c => c.id === id)

  return c.json(author)
})

app.delete('/:id', c => {
  const id = c.req.param('id')

  // updating the author details
  let index = authors.findIndex(c => c.id === id)
  if (index === -1) {
    return c.json({ error: 'Author not exist' }, 404)
  }
  authors.splice(index, 1)

  return c.body(null, 204) // 204 for sucessfully removing the author data
})

export default app
