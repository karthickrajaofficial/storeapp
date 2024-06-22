import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;
    // Read JWT from cookies
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send('Not authorized as Admin');
    }
};

export { authenticate, authorizeAdmin };
