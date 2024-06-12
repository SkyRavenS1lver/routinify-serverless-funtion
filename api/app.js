// 'use strict'
import Fastify from 'fastify';
import fastifyEnv from 'fastify-env';
// import mercurius from 'mercurius';
// import fp from 'fastify-plugin';
import * as dotenv from 'dotenv';
import fastifyPostgres from "@fastify/postgres";
dotenv.config()
//
// const fastify = Fastify({
//     logger: true,
// })
// fastify.register(fastifyPostgres, {
//     connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
//     ssl: { rejectUnauthorized: false }
// })
// // app.get('/', async function (req, reply) {
// //      const query = '{ add(x: 10, y: 10) }'
// //      return reply.status(200).graphql(query)
// // })
// fastify.get('/', (req, reply) => {
//     fastify.pg.connect(onConnect)
//
//     function onConnect (err, client, release) {
//         if (err) return reply.send(err)
//
//         client.query(
//             'INSERT INTO cars (brand, model, year)\n VALUES (\'Ford\', \'Mustang\', 1964);',
//             function onResult (err, result) {
//                 release()
//                 reply.send(err || result)
//             }
//         )
//     }
// })
//
// // const schema = `
// //   type Query {
// //     add(x: Int, y: Int): Int
// //   }
// // `
// //
// // const resolvers = {
// //     Query: {
// //         add: async (_, { x, y }) => x + y
// //     }
// // }
// //
// // app.register(mercurius, {
// //     schema,
// //     resolvers,
// //     graphiql: true
// // })
// //
// // app.get('/', async function (req, reply) {
// //     const query = '{ add(x: 10, y: 10) }'
// //     return reply.status(200).graphql(query)
// // })
// export default async function handler(req, reply) {
//     await fastify.ready()
//     fastify.server.emit('request', req, reply)
// }
const fastify = Fastify()
const schema = {
    type: 'object',
    required: ['DATABASE_HOST', 'DATABASE_NAME', 'DATABASE_USER', 'DATABASE_PASSWORD'],
    properties: {
        DATABASE_HOST: { type: 'string' },
        DATABASE_NAME: { type: 'string' },
        DATABASE_USER: { type: 'string' },
        DATABASE_PASSWORD: { type: 'string' }
    }
}

const options = {
    confKey: 'config', // optional, default: 'config'
    schema: schema,
    dotenv: true, // load .env
}

fastify.register(fastifyPostgres, {
    connectionString: `postgres://koyeb-adm:nHSLCTes4v9Z@ep-purple-flower-a17lobtn.ap-southeast-1.pg.koyeb.app/koyebdb?ssl=true`,
    // connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl=true`,
})
fastify.register(fastifyEnv, options).ready((err) => {
    if (err) console.error(err)

    fastify.register(fastifyPostgres, {
        connectionString: `postgres://${fastify.config.DATABASE_USER}:${fastify.config.DATABASE_PASSWORD}@${fastify.config.DATABASE_HOST}/${fastify.config.DATABASE_NAME}`,
        ssl: { rejectUnauthorized: false }
    })

    fastify.get('/', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { rows } = await client.query('SELECT * FROM your_table')
            reply.send(rows)
        } finally {
            client.release()
        }
    })

    const start = async () => {
        try {
            await fastify.listen(3000)
            fastify.log.info(`server listening on ${fastify.server.address().port}`)
        } catch (err) {
            fastify.log.error(err)
            process.exit(1)
        }
    }
    start()
})

// fastify.get('/', (req, reply) => {
//     fastify.pg.connect(onConnect)
//
//     function onConnect (err, client, release) {
//         if (err) return reply.send(err)
//
//         client.query(
//             'INSERT INTO cars (brand, model, year)\n VALUES (\'Ford\', \'Mustang\', 1964);',
//             function onResult (err, result) {
//                 release()
//                 reply.send(`postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl=true`)
//             }
//         )
//     }
// })
//
// fastify.listen({ port: 3000 }, err => {
//     if (err) throw err
//     console.log(`server listening on ${fastify.server.address().port}`)
// })