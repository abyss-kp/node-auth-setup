const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')

//DB setup
mongoose.connect('mongodb://localhost/auth')

//app setup
app.use(morgan('combined')) //logging middleware, used for debuging
app.use(bodyParser.json({ type: '*/*' }))//Parse incoming request into JSON
router(app)

//server setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on:', port)