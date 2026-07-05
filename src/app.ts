import express, { type Application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app : Application = express()

app.use(cors({
    origin: config.app
}))