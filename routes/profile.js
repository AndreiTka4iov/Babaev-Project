const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
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
    const checkAuth = req.signedCookies.id
    if (checkAuth != undefined){
        const sqlReq = "SELECT * FROM info_user WHERE id_user = "+ checkAuth +""
        const resSql = await db_all(sqlReq)
        res.render('index', { title: 'Profile', page: 'Profile', info: resSql[0]})
    } else{
        res.render('index', { title: 'Error', page: 'Error'})
    }
})

router.post('/edit', async (req, res) => { 
    try{
        const {firstname, lastname, address} = req.body
        const idUser = req.signedCookies.id
        const reqSql = "UPDATE info_user SET firstname = '"+ firstname +"', lastname = '"+ lastname +"', address = '"+ address +"' WHERE id_user = "+ idUser +""
        await db_all(reqSql)
        return res.redirect('/profile')
    } catch{
        return res.redirect('/profile')
    }
    
    console.log(firstname)
})

router.get('/favorite', async (req, res) => {  
    const checkAuth = req.signedCookies.id
    if (checkAuth != undefined){
        res.render('index', { title: 'Favorite', page: 'Favorite'})
    } else{
        res.render('index', { title: 'Error', page: 'Error'})
    }
})

router.get('/:any', (req, res) => {
    res.render('index', { title: 'Error', page: 'Error'})
})

module.exports = router