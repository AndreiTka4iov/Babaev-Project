const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
var Cookies = require('cookies')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database/main.db')


// settings
const port = 80
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(cookieParser('secret ecdc0f6bb1a12b909faf9ec54262f3a5'))

async function db_all(query){
  return new Promise(function(resolve,reject){
      db.all(query, function(err,rows){
         if(err){return reject(err);}
         resolve(rows);
       });
  });
}

//Routes for main url

app.get('/', async (req, res) => {  
  res.render('index', {title: 'Forum || Home', page: 'Home'})
})


//Server start

app.listen(port, () => console.log(`App listening on port ${port}!`))