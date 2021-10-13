import { knex as database, Knex } from 'knex'

import config from './config'

export const knex: Knex = database({
  client: config.DB_DRIVER,
  connection: {
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT),
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
  }
})
