const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const sqlite3 = require('sqlite3').verbose()
const url = require('url')
const db2 = new sqlite3.Database('./DB/main.db')

router.use(express.urlencoded({ extended: false}))
router.use(cookieParser('secret 950f8a398b18c8abb13f53f2f696a61b'))
router.use(fileUpload());

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
        var idUser = req.signedCookies.id 
        const urlRequest = url.parse(req.url, true)   
        const sqlReq = "SELECT admin FROM users WHERE id = "+ idUser +""
        const reqSql = await db_all(sqlReq)         

        if(reqSql.length == 1 && reqSql[0].admin == 1 && urlRequest.query.id != idUser && urlRequest.query.type == 'remove'){
            const sqlReq = "UPDATE users SET admin = '0' WHERE id = '"+ urlRequest.query.id +"'"
            await db_all(sqlReq)
            res.redirect('/admin')
        }else if(reqSql.length == 1 && reqSql[0].admin == 1 && urlRequest.query.type == 'add'){
            const sqlReq = "UPDATE users SET admin = '1' WHERE id = '"+ urlRequest.query.id +"'"
            await db_all(sqlReq)
            res.redirect('/admin')
        }else{
            res.render('index', {title: 'Error', page: 'Error'})
        }
    }catch{
        res.render('index', {title: 'Error', page: 'Error'})
    }
})

router.get('/item', async (req, res) => {
    try{
        const idUser = req.signedCookies.id
        const sqlReq = "SELECT admin FROM users WHERE id = "+ idUser +""
        const reqSql = await db_all(sqlReq)
        
        if(reqSql.length == 1 && reqSql[0].admin == 1){
            res.render('index', {title: 'Admin', page: 'addItem'})
        }else{
            res.render('index', {title: 'Error', page: 'Error'})
        }
    }catch{
        res.render('index', {title: 'Error', page: 'Error'})
    }
})

router.post('/create', async (req, res) => {    
    try{
        var encodedImage = req.files.imgUpload.data.toString('base64');
        var {title, descr, type, price} = req.body
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var today = dd + '.' + mm + '.' + yyyy;

        const idUser = req.signedCookies.id
        const sqlReq = "SELECT admin FROM users WHERE id = "+ idUser +""
        const reqSql = await db_all(sqlReq)
        
        if(reqSql.length == 1 && reqSql[0].admin == 1){
            const sqlReq = "INSERT INTO items (id, title, descr, img, price, date, type) VALUES (NULL, '"+ title +"', '"+ descr +"', '"+ encodedImage +"', '"+ price +"', '"+ today +"', '"+ type +"')"
            await db_all(sqlReq)
            res.redirect('/admin/item')
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