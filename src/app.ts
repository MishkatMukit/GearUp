import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import config from "./config"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import { routeHandler } from "./middleware/routerHandler"
import { authRoutes } from "./modules/auth/auth.route"
import { userRoutes } from "./modules/users/users.route"


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


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use(globalErrorHandler)
app.use(routeHandler)

export default app