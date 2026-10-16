import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { City } from './models/City.js'

const app = express()
const port = 3000
app.use(cors())
app.use(express.json())

app.get('/api/cities', async (req, res) => {
    try {
        const cities = await City.find()
        res.json(cities)
    } catch (error) {
        console.error('Failed to fetch cities:', error)
        res.status(500).json({ error: 'Failed to fetch cities' })
    }
})

app.post('/api/cities', async (req, res) => {
    try {
        const city = await City.create({ name: req.body?.name })
        res.status(201).json(city)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: 'A valid city name is required' })
        }

        console.error('Failed to create city:', error)
        res.status(500).json({ error: 'Failed to create city' })
    }
})

try {
    await mongoose.connect(process.env.MONGODB_URI)
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`)
    })
} catch (error) {
    console.error('Failed to connect to the database:', error)
    process.exitCode = 1
}