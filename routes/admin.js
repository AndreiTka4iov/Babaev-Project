const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const Cookies = require('cookies')
const sqlite3 = require('sqlite3').verbose()
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
    try{
        const idUser = req.signedCookies.id
        const sqlReq = "SELECT admin FROM users WHERE id = "+ idUser +""
        const reqSql = await db_all(sqlReq)
        const sqlReq2 = "SELECT DISTINCT id, login FROM users WHERE admin = 1"
        const listAdmin = await db_all(sqlReq2)
        const sqlReq3 = "SELECT DISTINCT id, login FROM users WHERE admin = 0"
        const listUsers = await db_all(sqlReq3)

        if(reqSql.length == 1 && reqSql[0].admin == 1){
            res.render('index', {title: 'Admin', page: 'admin', adminsList: listAdmin, usersList: listUsers})
        }else{
            res.render('index', {title: 'Error', page: 'Error'})
        }
    }catch{
        res.render('index', {title: 'Error', page: 'Error'})
    }
})

router.get('/addRem', async (req, res) => {
    try{
        const idUser = req.signedCookies.id
        const sqlReq = ""

        console.log()
        if(reqSql.length == 1 && reqSql[0].admin == 1){
            res.render('index', {title: 'Admin', page: 'admin', adminsList: listAdmin, usersList: listUsers})
        }else{
            res.render('index', {title: 'Error', page: 'Error'})
        }
    }catch{
        res.render('index', {title: 'Error', page: 'Error'})
    }
})


router.get('/:any', (req, res) => {
    res.render('index', { title: 'Error', page: 'Error'})
})
  
module.exports = router