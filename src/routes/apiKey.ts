import { Hono } from 'hono'
import z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { db } from '../db/db.ts'
import { UserTable } from '../db/schema.ts'
import { hashPassword, verifyPassword } from '../lib/encrypt.ts'
import { jwt, sign } from 'hono/jwt'
import { env } from '../data/env.ts'

const app = new Hono<JwtEnv>()

type JwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number }
  }
}

export default app
