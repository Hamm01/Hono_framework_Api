import { Hono } from 'hono'

const app = new Hono()

const authors = [
  {
    id: '1',
    name: 'jijlu'
  },
  {
    id: '2',
    name: 'kumar'
  }
]

app.get('/', c => {
  // Getting all the authors as json
  return c.json(authors)
})
app.get('/:id', c => {
  const id = c.req.param('id')
  const author = authors.find(c => c.id === id)
  if (author == null) {
    return c.json({ error: 'Author not exist' })
  }
  return c.json(author)
})

export default app
