const async_handler =require('express-async-handler')
const User = require('../Model/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../Model/tokenModel')
const crypto = require('crypto');
// const sendMail = require('../utility/sendMail');


//functtion to generate a token with user id
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
};


const registerUser = async_handler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    // Check if the user email already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(404);
        throw new Error('Email has already been registered');
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Send token to the client 
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date('9999-12-31T23:59:59Z'),
        sameSite: 'none',
        secure: true,
    });

    // Send user data and token in the response
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        token,
    });
});


     //Login User 
     const loginUser = async_handler(async (req, res) => {
        const { email, password } = req.body;
    
        // Validate request
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide both email and password');
        }
    
        // Check if email exists
        const user = await User.findOne({ email });
    
        if (!user) {
            res.status(400);
            throw new Error('User not found, please sign up');
        }
    
        // Check if the password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
    
        if (!passwordIsCorrect) {
            res.status(400);
            throw new Error('Invalid email or password');
        }
    
        // Generate token
        const token = generateToken(user._id);
    
        // Send token to the client (Flutter)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
            token, // Send the token to the client
        });
    });
    

     //logout user
   
const logOutUser = async_handler(async (req, res) => {
    
    return res.status(200).json({ message: 'logout successfully' });
 });
 
// Get Userconst 
    const getUser = async_handler(async(req,res) =>{
        const user = await User.findById(req.user._id)
        if (user){
            const { _id, name, email, photo, phone, bio,password } = user;
            res.status(200).json(
                {
                    _id,
                    name,
                    email,
                    photo,
                    phone,
                    bio,
                password
                
            });
        
        }else{
            res.status(400);
            throw new Error('User not Found')
        }
        
        })

        //get logged in status
        // get logged in status
const loggedInStatus = async_handler(async(req,res)=>{
    const token = req.cookies.token
    if(!token){
        return res.json(false)
    }
     //verify token
     const verified = jwt.verify(token, process.env.JWT_SECRET);
     if(verified){
        return res.json(true)
     }
     return res.json(false)
    }
    
    
    )

// Update user
const UpdateUser = async_handler( async(req,res)=>{
    const user = await User.findById(req.user._id)
    
    if(user){
        const {name , email, photo, phone, bio} = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
    
    const updatedUser = await user.save()
    res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        photo:updatedUser.photo,
        phone:updatedUser.phone,
        bio:updatedUser.bio,
    })
    }
    else{
        res.status(404)
        throw new Error("User not found")
    }
    })
    
    const ChangePassword = async_handler(async(req,res) =>{
        const user = await User.findById(req.user._id);
    
    
        const {oldPassword, password} = req.body
    
    
        if(!user){
            res.status(400);
            throw new Error('User Not Found, sign up');
        }
    // validation
        if(!oldPassword || !password){
    res.status(400);
    throw new Error('please add old and new password ');
        }
    
        //check  if old password matches passwordin DB
    
        const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)
    
    
        // Sava new password 
        if (user && passwordIsCorrect){
            user.password = password
            await user.save()
            res.status(200).send('password change successful')
        }else{
            res.status(404);
            throw new Error('Old passwword is incorrect ');
        }
    
    
    })
//forgot password

    const forgotpassword =async_handler(async(req,res)=>{
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(404)
            throw new Error('User does not exist')
        }
        //delete token if token exist
        let token = await Token.findOne({userId: user._id})
        if(token){
            await token.deleteOne()
        }
    // create reset token
    let resetToken = crypto.randomBytes(32).toString('hex') + user._id
    // console.log(resetToken)
    
    // hash token b4 saving to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // console.log(hashedToken)
    
    
    ///save token to DB
    
    await new Token({
    userId:user._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt:Date.now()+30 *(60*1000) //30minutes
    }).save()
    
    //construction of reset URL
    const resetURL = `${process.env.CLIENT_URL}/resetpassword/ ${resetToken}`
    //frontend url = process.env.CLIENT_URL
    
    //reset email construct
    const message =`
    <h2>Hello ${user.name}</h2>
    <p>Please use the URL below to reset your password</p>
    <p>The reset link is only valid for 29 minutes</P>
    
    <a href=${resetURL} clicktracking=off>${resetURL}</a>
    <p>Regards...</p>
    <p>Sahar009</p>`
    
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    
    // await sendMail(subject, message, send_to, sent_from);
    // res.status(200).json({ success: true, message: "Reset Email Sent" });
    try {
      await sendMail(subject, message, send_to, sent_from);
      res.status(200).json({ success: true, message: "Reset Email Sent" });
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again some other time");
    }
    
    
    }) ;
    //Reset password
    const resetPassword = async_handler(async (req, res,next) => {
        const { password } = req.body;
        const { resetToken } = req.params;
      
        // Hash token, then compare to Token in DB
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
      
        // fIND TOKEN in DB
        const userToken = await Token.findOne({
          token: hashedToken,
          expiresAt: { $gt: Date.now() },
        });
      
        if (!userToken) {
          res.status(404);
          throw new Error("Invalid or Expired Token");
        }
      
        // Find user
        const user = await User.findOne({ _id: userToken.userId });
        user.password = password;
        await user.save();
        res.status(200).json({
          message: "Password Reset Successful, Please Login",
        });
      });

module.exports ={
    registerUser,
    loginUser,
    logOutUser,
    getUser,
    loggedInStatus,
    UpdateUser,
    ChangePassword,
    forgotpassword,
    resetPassword,
   
  
}