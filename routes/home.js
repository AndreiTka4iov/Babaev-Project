const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const Cookies = require('cookies')
const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')
const db2 = new sqlite3.Database('./DB/main.db')

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
    const sqlReq = "SELECT * FROM items"
    const resSql = await db_all(sqlReq)  
    res.render('index', {title: 'Market || Home', page: 'Home', items: resSql})
})



module.exports = router