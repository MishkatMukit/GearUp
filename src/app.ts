import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import config from "./config"


const app : Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', async (req: Request, res: Response) => {
    res.json({
        message : "GearUp server is running",
        Auhtor : "Mishkat Mahabub"
    })
    
})

export default app