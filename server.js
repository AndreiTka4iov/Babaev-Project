const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const Cookies = require('cookies')
const sqlite3 = require('sqlite3').verbose()


// settings
const port = 80

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

//Routes for main url

app.use(cookieParser('secret 950f8a398b18c8abb13f53f2f696a61b'))

app.use((req,res, next) => {
  if(typeof req.signedCookies.login !== 'undefined'){
    tempLogin = req.signedCookies.login
  }else{
    tempLogin = 0
  }

  if(typeof req.signedCookies.id !== 'undefined'){
    tempId = req.signedCookies.id
  }else{
    tempId = 0
  }

  if(typeof req.signedCookies.token !== 'undefined'){
    tempToken = req.signedCookies.token
  }else{
    tempToken = 0
  }

  res.locals = {
    token: tempToken,
    login: tempLogin,
    id: tempId
  }
  next()
})

const homeRouter = require('./routes/home')
app.use('/', homeRouter)

const itemRouter = require('./routes/item')
app.use('/item', itemRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

const profileRouter = require('./routes/profile')
app.use('/profile', profileRouter)

// 404

app.get('/:any', (req, res) => {
  res.render('index', { title: 'Error', page: 'Error'})
})

//Server start

app.listen(port, () => console.log(`App listening on port ${port}!`))