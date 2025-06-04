import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { UnauthorizedError } from '../utils/exception.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('No token provided'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError('Invalid token format'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {  
    return next(new UnauthorizedError('Invalid token'));
  }
};


