import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

import httpStatusCodes from "../responses/httpStatusCodes.js";


const create_Save_And_Send_Token = async (user, res) =>{

    // Create token 
    const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});

    // Save token to the database
    user.tokens.push(jwtToken);    
    await user.save();

    // Send response to the client
    return res.status(httpStatusCodes.ACCEPTED).json(
        {
            user: user,
            token: jwtToken
        }
    );
}

export default create_Save_And_Send_Token;