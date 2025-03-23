import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '../data/env.ts'
import { relations } from './relations.ts'

export const db = drizzle({
  relations,
  connection: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    database: env.DB_NAME,
    port: env.DB_PORT
  }
})
