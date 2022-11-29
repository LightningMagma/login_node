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





sample.get('/login',(req, res)=>{
    res.render('login')
})
sample.get('/registro',(req, res)=>{
    res.render('registro')
})

sample.post('/registro', async (req, res)=>{
    const user= req.body.user;
    const password= req.body.password;
    let passwordHaash=await bcryptjs.hash(password, 8);
    conexion.query('insert into users set ?', {username:user, password:passwordHaash}, async(error, results)=>{
        if (error) {
            console.log(error);
        } else {
            res.render('registro',{
                alert:true, alertTitle: "Sign up", alertMessage: "Successful registration", alertIcon:'success', showConfirmButton:false, timer:1500, ruta:'login'
            })
        }
    })
})

sample.post('/auth', async (req, res)=>{
    const user= req.body.user;
    const password= req.body.password;
    let passwordHaash=await bcryptjs.hash(password,8)
    if (user && password) {
        conexion.query('select * from users where username = ?', [user], async(error, results)=>{
            if (results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
                res.render('login',{
                    alert:true, alertTitle: "Error", alertMessage: "Incorrect user or password", alertIcon:'error', showConfirmButton:true, timer:false, ruta:'login'
                })
            } else{
                req.session.loggedin=true;
                req.session.name=results[0].username
                res.render('login',{
                    alert:true, alertTitle: "Successful connection", alertMessage: "Correct login", alertIcon:'success', showConfirmButton:false, timer:1500, ruta:''
                })
            }
        })
    }else{
        res.render('login',{
            alert:true, alertTitle: "Warning", alertMessage: "Type a username and a password", alertIcon:'warning', showConfirmButton:true, timer:false, ruta:'login'
        })
    }
})

sample.get('/', (req, res)=>{
    if (req.session.loggedin) {
        res.render('index',{
            login:true,
            name: req.session.name
        });
    }else{
        res.render('index',{
            login:false,
            name:'Please sign in'
        })
    }
})

sample.listen(8080, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:8080')
})

