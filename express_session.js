var express = require('express')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var app = express()

app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   store: new FileStore()   // default path is ./sessions
}))

app.get('/', function (req, res) {
   console.log(req.session)
   if(req.session.num === undefined) {
      req.session.num = 1
   } else {
      req.session.num++
   }
   res.send(`Views : ${req.session.num}`)
})

app.listen(3000, () => console.log('Listening on port 3000!'))