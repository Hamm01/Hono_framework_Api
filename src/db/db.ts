import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '../data/env.ts'

export const db = drizzle({
  connection: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    database: env.DB_NAME,
    port: env.DB_PORT
  }
})
