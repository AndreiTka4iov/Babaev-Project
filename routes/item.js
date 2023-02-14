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
    try{
        const urlRequest = url.parse(req.url, true)
        const idItem = urlRequest.query.id
        const sqlReq = "SELECT * FROM items WHERE id="+ idItem +""
        const resSql = await db_all(sqlReq)
        const sqlReq2 = "SELECT * FROM items WHERE type = "+ urlRequest.query.type +" ORDER BY view DESC"
        const resSql2 = await db_all(sqlReq2)
        const sqlReq3 = "UPDATE items SET view=view+1 WHERE id="+ idItem +""
        await db_all(sqlReq3)
        if(resSql.length != 0 && req.signedCookies.id != undefined){
            const sqlReq4 = "SELECT DISTINCT * FROM favorite WHERE id_user = "+ req.signedCookies.id +" AND id_item = "+ resSql[0].id +""
            const resSql4 = await db_all(sqlReq4) 
            res.render('index', {title: 'Market || Item', page: 'Item', item: resSql[0], rec: resSql2, favorite: resSql4[0]})
        }else if (resSql.length == 0){
            res.render('index', { title: 'Error', page: 'Error'})
        }else{
            res.render('index', {title: 'Market || Item', page: 'Item', item: resSql[0], rec: resSql2})
        }
    } catch{
        res.render('index', { title: 'Error', page: 'Error'})
    }
})

router.get('/:any', (req, res) => {
    res.render('index', { title: 'Error', page: 'Error'})
})

module.exports = router