const express= require ('express');
const sample=express();

sample.use(express.urlencoded({extended:false}));
sample.use(express.json());

const dotenv= require('dotenv');
dotenv.config({path:'./env/.env'})

sample.use('/resources', express.static('public'));
sample.use('/resources', express.static(__dirname+'public'));

sample.set('view engine', 'ejs');

const bcryptjs= require('bcryptjs');

const session= require('express-session');
sample.use(session({
    secret:'secret', resave:true, saveUninitialized:true
}));

const conexion= require('./database/database');




sample.get('/',(req, res)=>{
    res.render('index', {msg: 'waaaaa'})
})
sample.get('/login',(req, res)=>{
    res.render('login')
})

sample.listen(8080, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:8080')
})

