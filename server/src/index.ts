import "dotenv/config"
import { app } from "./app"

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => console.log(`API Running on http://172.30.188.218:${port}`))
