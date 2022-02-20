import catchAsyncError from '../utils/catchAsyncError.js';
import baseError from '../utils/baseError.js';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import User from '../models/user.js';
import moment from 'moment';
import create_Save_And_Send_Token from '../utils/create_Save_And_Send_Token.js';
import factoryController from './factoryController.js';
import generateRandomOtp from '../utils/generateRandomOtp.js';


const userController = {
    getAll: factoryController.getAll(User),

    getOne: factoryController.getOne(User),

    updateOne: factoryController.updateOne(User),

    deleteOne: factoryController.deleteOne(User),
}

export default userController;