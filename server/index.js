import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDb } from './config/dbConfig.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT;

app.use(cors())

connectDb()

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))