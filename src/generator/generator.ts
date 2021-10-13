import * as fs from 'fs'
import { getStructure } from './tables'
import { getSql } from './sql'
import { createTypescriptHelper } from './typescript'

const structure = getStructure('./src/model.ts')

// fs.writeFileSync('./src/db.ts', createTypescriptHelper(structure), { encoding: 'utf-8' })
fs.writeFileSync('./init_db.sql', getSql(structure), { encoding: 'utf-8' })
