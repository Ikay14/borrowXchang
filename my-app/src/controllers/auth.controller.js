import { BadRequestError, UnauthorizedError } from '../utils/exception.js';
import jwt from "jsonwebtoken";
import User from '../models/user.model.js';
import Wallet from '../models/wallet.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 
import { generateToken } from '../utils/jwt.js';
import { successResponse } from '../utils/responseFormatter.js';


export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return next(new BadRequestError('Email and password are required'));

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new BadRequestError('User already exists'));
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      email, 
      password: hashedPassword 
    });

    // Auto-create wallet for new user
    const wallet = await Wallet.create({  
      user: user._id,
      walletId: uuidv4(),
      balance: 100,
    });  

    const accessToken = generateToken(user._id, user.email);

   return successResponse(res, {
  message: 'User registered successfully',
  data: {
    user: {
      id: user._id,
      email: user.email,
    },
    wallet: {
      id: wallet._id,
      walletId: wallet.walletId,
      balance: wallet.balance,
    },
    accessToken,
  },
  statusCode: 201,
});


  } catch (error) {
    return next(error);
  }
};
  
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new BadRequestError('Email and password are required'));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new BadRequestError('User not found'));
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(new UnauthorizedError('Invalid credentials'));
        }

        // Get user's wallet
        const wallet = await Wallet.findOne({ user: user._id });
        if (!wallet) {
            return next(new BadRequestError('Wallet not found'));
        }

        const accessToken = generateToken(user._id, user.email);

        return res.status(200).json({
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                },
                wallet: {
                    id: wallet._id,
                    walletId: wallet.walletId,
                    balance: wallet.balance,
                },
                accessToken,
            }
        });

    } catch (error) {
        return next(error);
    }
};


export const generateAccessToken = (userId, user) => { 
    const payload = {
        id: userId,  
        email: user.email
    };
  
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};
