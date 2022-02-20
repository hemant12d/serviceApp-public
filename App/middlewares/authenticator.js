// Load Environmental Variable
import dotenv from 'dotenv';
dotenv.config();


import baseError from '../utils/baseError.js';

// http responses
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';

import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import catchAsyncError from '../utils/catchAsyncError.js';

// Model
import User from '../models/user.js';

const authenticator = catchAsyncError(async (req, res, next)=>{
    let jwtToken;

    // check if headers has authorization
    if(
        req.headers.authorization 
        && req.headers.authorization.startsWith('Bearer')
    ){
        jwtToken = req.headers.authorization.split(' ')[1];
    }


    // check if jwt is exists or not
    if(!jwtToken){
        return next(new baseError(responseMessages.USER_NOT_LOGIN, httpStatusCodes.BAD_REQUEST))
    }


    // Varification of Token
    const decodeToken = await promisify(jwt.verify)(jwtToken, process.env.JWT_SECRET_KEY);
    
    // => decodeToken output be like { id: '61dd5e3153da306f8995f052', iat: 1641905933, exp: 1649681933 }

    // "iat" stands for => issued at 
    // "iat" & exp contains time in seconds not in miliseconds


    // Ensure that token user still active
    const freshUser = await User.findById(decodeToken.id);

    if (!freshUser) return next(new baseError(responseMessages.TOKEN_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST));


    // Ensure that user token is exists & user is login in device with token
    if(freshUser.tokens.length < 1 || !(freshUser.tokens.includes(jwtToken))){
        return next(new baseError(responseMessages.LOGIN_TO_CONTINUE, httpStatusCodes.UNAUTHORIZED))
    }


    // Attech user to request 
    req.user = freshUser;
    req.jwtToken = jwtToken;

    // Access granted
    return next();
});

export default authenticator;