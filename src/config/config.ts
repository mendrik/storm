import { config as dotenv } from 'dotenv'

const config = dotenv().parsed as Record<DbConfig, string>

export type DbConfig = 'DB_PORT' | 'DB_NAME' | 'DB_USER' | 'DB_PASSWORD' | 'DB_HOST' | 'DB_DRIVER'

export default config
