const async_handler =require('express-async-handler')
const User = require('../Model/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const Token = require('../models/tokenModel')
const crypto = require('crypto');
// const sendMail = require('../utility/sendMail');


//functtion to generate a token with user id
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
};


const registerUser = async_handler( async(req,res) =>{
    const {name,email, password} = req.body
    //or req.body.email

    //validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error('please fill in all required fields')
    }
    if (password.length < 6){
        res.status(400)
        throw new Error('password must be up to 6 characters')
    }
    //check if user email already exist
    const user_exist = await User.findOne({email})
    if(user_exist){
        res.status(404)
        throw new Error('Email has already been registered')
    }
    
// Encrypt password

// const salt = await bcrypt.genSalt(10)
// const harshedpassword = await bcrypt.hash(password,salt)
  


    //create new user
    const user = await User.create({
        name:name,
        email:email,
        password:password
    })
    //Generate token 
    const token = generateToken(user._id)

    //send HTTP ONL COOKIE

    res.cookie('token', token, {
        path:'/',
        httpOnly:true,
        // expires:new Date(Date.now() + 1000 * 86400), //1 day
        expires: new Date('9999-12-31T23:59:59Z'),
        sameSite:'none',
        secure:true

    })
    //get user back
    if (user){
        const { _id, name, email, photo } = user;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            token,

        })
    }else{
        res.status(400)
        throw new Error('Invalid User')
    }

     });

     //Login User 
     const loginUser = async_handler(async(req,res) =>{
        // res.send('login user')
        const {email,password} = req.body
        // validate request
        if(!email || !password){
            res.status(400);
            throw new Error('please add email and password')
        }
        // check if email exist 
        const user = await User.findOne({email})
       
        if (!user){
            res.status(400);
            throw new Error('User not found  plesae sign up');
        }
        //user exists , check if password is correct 
        const passwordIsCorrect = await bcrypt.compare(password,user.password)
        //send HTTP ONL COOKIE
        const token = generateToken(user._id);

        if(passwordIsCorrect){
            res.cookie('token', token, {
                path:'/',
                httpOnly:true,
                // expires:new Date(Date.now() + 1000 * 86400), //1 day
                expires: new Date('9999-12-31T23:59:59Z'),
                sameSite:'none',
                secure:true
        
            })
        }
        if (user && passwordIsCorrect){
            const { _id, name, email, photo, phone, bio,password } = user;
            res.status(200).json({
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                password,
                token,
            });

        }else{
            res.status(400);
            throw new Error('invalid email or password')
        }
    }

     )

     //logout user
     const logOutUser = async_handler(async(req,res) =>{
        res.cookie('token', '', {
            path:'/',
            httpOnly:true,
            expires:new Date(0), //1 day
            sameSite:'none',
            secure:true
    
        });
        return res.status(200).json({message:'logout succesfully'})
     })
     
// Get User

module.exports ={
    registerUser,
    loginUser,
    logOutUser,
   
  
}