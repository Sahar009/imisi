const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()
const userRoute = require('../Route/UserRoute')
const listenerRoute = require('../Route/ListenerRoute');
const musicRoute = require('../Route/musicRoute')
const dotenv = require('dotenv').config()
const PORT =5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const path = require('path');
const serverPath = path.resolve(__dirname, 'server.js');
require(serverPath);

app.get('/', (req,res) =>{
    res.send('Home page');
    });



    //middlewaress
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//route middleware
//Routes middleware
app.use('/api/users', userRoute)
app.use('/api/listeners',listenerRoute )
app.use('/api/musics', musicRoute)
    

    mongoose.connect(`mongodb+srv://akinwumisehinde:sahar@cluster0.3fqmwzt.mongodb.net/imis?retryWrites=true&w=majority`)
    .then(() =>{
        app.listen(PORT,()=>{
            console.log(`Port now starting on Port ${PORT}`)
        })
    })//sahar
    .catch((err) => console.log(err))
    

