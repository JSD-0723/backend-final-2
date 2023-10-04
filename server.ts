import Config from "./src/config/environment"

import express, { Request, Response, NextFunction } from "express"

import serverErrorHandler from "./src/utils/error/serverErrorHandler"
import clientErrorHandler from "./src/utils/error/clientErrorHandler"

import apiRouter from "./src/routers"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use api router
app.use("/api/v1/", apiRouter)

// hello world
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Hello world!",
  })
})

// client error handler
app.use(clientErrorHandler)

// error handler
app.use(serverErrorHandler)

app.listen(Config.server.port, () =>
  console.log(`Server running on port ${Config.server.port}`)
)
