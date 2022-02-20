import fs from 'fs';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import baseError from './baseError.js';

const removeFile = (path)=>{
    const removePath = "./"+path;

    console.log("Path for remove", path);

    return new Promise((resolve, reject)=>{

        // Validation is important as perspective of Ds&algo
        if(path instanceof Object || path instanceof Array || typeof path !== 'string'){
            reject(new baseError(
                responseMessages.PLEASE_PATH_AS_STRING,
                httpStatusCodes.UNPROCESSABLE
            ));    
        }

        
        // Remove file
        fs.unlink(removePath, async function(err) {
            if(err && err.code == 'ENOENT') 
            reject(new baseError(
                responseMessages.NOT_FOUND_TO_REMOVE,
                httpStatusCodes.NOT_FOUND
            ));           

            else if (err)
                // other errors, e.g. maybe we don't have enough permission
                return reject(new baseError(
                    responseMessages.NOT_ABLE_TO_DELETE,
                    httpStatusCodes.SERVICE_ERROR
                ));
                    
            else                 
                resolve();
            
        });
    });
}

export default removeFile;