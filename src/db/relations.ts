import { defineRelations } from 'drizzle-orm'
import * as schema from './schema.ts'

export const relations = defineRelations(schema, r => ({
  ApiKeyTable: {
    user: r.one.UserTable({ from: r.ApiKeyTable.userId, to: r.UserTable.id })
  },
  AuthorTable: {
    books: r.many.BookTable()
    // author have one to may relationship
  },
  BookTable: {
    author: r.one.AuthorTable({
      from: r.BookTable.authorId,
      to: r.AuthorTable.id
    }),
    // In book table one book is relation to one author and same as to one user who created the book in db
    addedByUser: r.one.UserTable({
      from: r.BookTable.addedBy,
      to: r.UserTable.id
    })
  },
  UserTable: {
    apiKeys: r.many.ApiKeyTable(),
    booksAdded: r.many.BookTable()
    // user with as many api keys , and many books he can add, one to many relationship
  }
}))
