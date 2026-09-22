import express from "express"
import cors from "cors"
import { logger } from "./middleware/logger"
import { errorHandler } from "./middleware/error"
import { taskRouter } from "./routes/tasks"

export const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(logger)

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" })
})
app.use("/api/tasks", taskRouter)

app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler)