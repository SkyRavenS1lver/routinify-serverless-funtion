'use strict'
import Fastify from 'fastify'
import mercurius from 'mercurius';

const app = Fastify({
    logger: true,
})

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
    Query: {
        add: async (_, { x, y }) => x + y
    }
}

app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true
})

app.get('/', async function (req, reply) {
    const query = '{ add(x: 2, y: 2) }'
    return reply.status(200).graphql(query)
})
// Run the server!
// app.listen({ port: 3000 }, function (err, address) {
//     if (err) {
//         app.log.error(err)
//         process.exit(1)
//     }
// })
export default async function handler(req, reply) {
    await app.ready()
    app.server.emit('request', req, reply)
}