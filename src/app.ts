import { head } from 'ramda'
import { knex } from './config/knex'
import { users } from './db'
import { filter, orderBy, propEq, storm } from './types/pipe'

// prettier-ignore
const run = async () =>
  storm(users.address.city)(
    orderBy('zipCode', true),
    filter(propEq('zipCode', 770)),
  )

run()
  .then(console.log)
  .then(() => knex.destroy())
