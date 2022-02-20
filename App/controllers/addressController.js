import fs from 'fs';
import Address from "../models/address.js"
import baseError from "../utils/baseError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import httpStatusCodes from "../responses/httpStatusCodes.js";
import responseMessages from "../responses/responseMessages.js";
import appConfig from "../config/appConfig.js";
import factoryController from './factoryController.js';



const addressController = {

    create: factoryController.createOne(Address),

    myAddresss: catchAsyncError(async (req, res, next)=>{

        const userAddress = await Address.find({user: req.user._id});

        if( (userAddress.length) < 1 )
            return next(new baseError(
                responseMessages.USER_DO_NOT_HAVE_ADDRESS,
                httpStatusCodes.ACCEPTED
            ))

        return res.status(httpStatusCodes.ACCEPTED).json({
            totalResults: userAddress.length,
            userAddress
        });
    }),

    update: catchAsyncError(async (req, res, next)=>{

        // If client is send payload to update user & then remove
        if(req.body.user){
            delete req.body.user;
        }

        const updateAddress = await Address.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.id
            },
            req.body,
            {
                runValidators: true
            }
        );

        if(!updateAddress)
            return next(new baseError(
                responseMessages.ADDRESS_NOT_AVAILABLE_TO_UPDATE,
                httpStatusCodes.BAD_REQUEST
            ))

        return res.status(httpStatusCodes.OK).json(updateAddress);
    }),


    deleteOne: catchAsyncError(async (req, res, next)=>{
        let deleteAddress = await Address.findOneAndDelete(
            {
                user: req.user._id,
                _id: req.params.id
            }
        );

        if(!deleteAddress)
            return next(new baseError(
                responseMessages.ADDRESS_NOT_AVAILABLE_TO_DELETE,
                httpStatusCodes.BAD_REQUEST
            ));

        return res.status(httpStatusCodes.NO_CONTENT).json();
    }),

}

export default addressController;