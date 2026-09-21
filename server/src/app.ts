import express from "express"
import cors from "cors"
import { logger } from "./middleware/logger"
import { taskRouter } from "./routes/tasks"

export const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(logger)

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" })
})
app.use("/api/tasks", taskRouter)