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

app.get('/', async (req, res) => {  
  res.render('index', {title: 'Market || Home', page: 'Home'})
})


//Server start

app.listen(port, () => console.log(`App listening on port ${port}!`))