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

function makeToken(length) {
    var result = '';
    var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/sign-in', async (req, res) =>{
    const {login, pass} = req.body
    const md5Pass = md5(pass)
    const sqlReq = "SELECT * FROM users WHERE login='"+ login +"' AND pass='"+ md5Pass +"'"
    
    try{
        const reqSql = await db_all(sqlReq)
        if (reqSql.length  == 0 || reqSql.length > 1){ 
            return res.end(JSON.stringify(false)) 
        } else { 
            res.cookie('id', reqSql[0].id, {httpOnly: true, signed: true})
            res.cookie('login', reqSql[0].login, {httpOnly: true, signed: true})
            res.cookie('token', reqSql[0].token, {httpOnly: true, signed: true})
            return res.end(JSON.stringify(true)) 
        }  
    }catch{
        return res.end(JSON.stringify(false))
    }
})

router.post('/sign-up', async (req, res) =>{
    const token = makeToken(20)
    const {login, pass} = req.body
    const md5Pass = md5(pass)
    const sqlReq = "INSERT INTO `users` (login, pass, token) VALUES  ('"+ login +"', '"+ md5Pass +"', '"+ token +"')"
    const sqlReq2 = "SELECT * FROM users WHERE `token`='"+ token +"'"
    
    try{
        const reqSql = await db_all(sqlReq)
        const reqSql2 = await db_all(sqlReq2)
        if (reqSql2.length  == 0 || reqSql.length > 1){ 
            return res.end(JSON.stringify(false)) 
        } else { 
            res.cookie('id', reqSql2[0].id, {httpOnly: true, signed: true})
            res.cookie('login', reqSql2[0].login, {httpOnly: true, signed: true})
            res.cookie('token', reqSql2[0].token, {httpOnly: true, signed: true})
            return res.end(JSON.stringify(true)) 
        }  
    }catch{
        return res.end(JSON.stringify(false))
    }
})

router.post('/checkLogin', async (req, res) =>{
    const login = req.body.login
    const sqlReq = "SELECT * FROM users WHERE login='"+ login +"'"
  
    try{
        const reqSql = await db_all(sqlReq)

        if (reqSql.length == 0){ 
            return res.end(JSON.stringify(true))
        } else { 
            return res.end(JSON.stringify(false)) 
        }  
    }catch{
        return res.end(JSON.stringify(false))
    }
})

  
module.exports = router