import { Hono } from 'hono'

const app = new Hono()

app.get('/', c => {
  return c.text('Hello to authors route api')
})

export default app
