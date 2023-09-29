import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Product } from './src/entities/Product'
import { User } from './src/entities/User'

dotenv.config()

export default new DataSource({
    type:'postgres',
    url: process.env.DATABASE_URL,
    entities: [Product, User],
    synchronize: true
})