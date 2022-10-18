const express = require('express')
require('./db/mongoose')
const Task = require('./models/tasks')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

// initializing server

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up running at ' + port)
})
