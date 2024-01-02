import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'
import initWebRouters from './route/web'
import connectDB from './config/connectDB'
import cors from 'cors'
const corsOrigin = {
  origin: 'http://localhost:3000', // or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200
}
let cookieParser = require('cookie-parser')
require(`dotenv`).config()
let app = express()

app.use(cors(corsOrigin))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

// config app
viewEngine(app)
initWebRouters(app)
connectDB(app)
let port = process.env.PORT || 8080
app.listen(port, () => {
  // callback
  console.log(`Backend nodejs is running on the port :` + port)
})
