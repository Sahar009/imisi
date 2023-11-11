const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()
const userRoute = require('../Route/UserRoute')
const dotenv = require('dotenv').config()
const PORT =5000



app.get('/', (req,res) =>{
    res.send('Home page');
    });

app.use(express.urlencoded({extended:false}))
//route middleware
//Routes middleware
app.use('/api/users', userRoute)
    

    mongoose.connect(`mongodb+srv://akinwumisehinde:sahar@cluster0.3fqmwzt.mongodb.net/imis?retryWrites=true&w=majority`)
    .then(() =>{
        app.listen(PORT,()=>{
            console.log(`Port now starting on Port ${PORT}`)
        })
    })//sahar
    .catch((err) => console.log(err))
    

