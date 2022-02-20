import baseError from '../utils/baseError.js';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';

const accessController = (roles) =>{

    return (req, res, next) =>{

        if(!roles.includes(req.user.role)){
            return next(new baseError(responseMessages.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED));
        }
        
        next();
    }

}

export default accessController;
