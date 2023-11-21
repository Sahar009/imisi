const async_handler = require('express-async-handler')
const Listener = require('../Model/listenerModel');
const jwt = require('jsonwebtoken')

const protect = async_handler(async(req,res,next) =>{
    try {
        const token = req.cookies.token;
        if (!token) {
          res.status(401);
          throw new Error("Not authorized, please login");
        }
    
        // Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Get user id sfrom token
        const listener = await Listener.findById(verified.id).select("-password");
    
        if (!listener) {
          res.status(401);
          throw new Error("User not found");
        }
        req.user = listener;
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login");
      }
    });
module.exports = protect