const async_handler = require('express-async-handler');
const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');

const protect = async_handler(async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    const token = authorizationHeader.split(' ')[1];
    console.log('Received token:', token);

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Get user id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
});

module.exports = protect;
