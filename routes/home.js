const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const sqlite3 = require('sqlite3').verbose()
const db2 = new sqlite3.Database('./DB/main.db')
const url = require('url')

router.use(express.urlencoded({ extended: false}))
router.use(cookieParser('secret 950f8a398b18c8abb13f53f2f696a61b'))

async function db_all(query){
    return new Promise(function(resolve,reject){
        db2.all(query, function(err,rows){
           if(err){return reject(err);}
           resolve(rows);
         });
    });
}

router.get('/', async (req, res) => {
    const urlRequest = url.parse(req.url, true)
    const idItem = urlRequest.query.by

    if (idItem == undefined){
        var sqlReq = "SELECT * FROM items"
    } else{
        var sqlReq = "SELECT * FROM items WHERE type = "+ idItem +""
    }
    
    const resSql = await db_all(sqlReq)  
    res.render('index', {title: 'Market || Home', page: 'Home', items: resSql})
})

router.get('/search', async (req, res) => {
    const urlRequest = url.parse(req.url, true)
    const sqlReq = "SELECT * FROM items WHERE title LIKE '%"+ urlRequest.query.input +"%' OR descr LIKE '%"+ urlRequest.query.input +"%' ORDER BY view DESC"
    const dbReq = await db_all(sqlReq)
    return res.end(JSON.stringify(dbReq))
  })



module.exports = router