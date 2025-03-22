import { defineRelations } from 'drizzle-orm'
import * as schema from './schemas.ts'

export const relations = defineRelations(schema)
