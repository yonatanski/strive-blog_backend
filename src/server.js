import express from "express" // 3RD PARTY MODULE DOES NEED TO INSTALL
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import authorsRouter from "./services/authors/index.js"
import blogpostRouter from "./services/blogpost/index.js"
import { badReequestHandler, unauthorizedtHandler, notFoundHandler, genericErrorHandler } from "./errorHandler.js"

const server = express() // declearing server

server.use(cors())
server.use(express.json()) // if this not worte here the request body will be undifend

// ************************** ENDPOINT ****************
server.use("/authors", authorsRouter)
server.use("/blogpost", blogpostRouter)

// ====================================ERROR MIDDLEWARES======================================

server.use(badReequestHandler)
server.use(unauthorizedtHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server)) // TO PRINT THE END POINT TABLE ON TERMINAL

const port = 3003
server.listen(port, () => {
  console.log("SEREVER IS 🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️ ON PORT", port)
})
