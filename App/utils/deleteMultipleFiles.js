import fs from 'fs';
import baseError from './baseError.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import responseMessages from '../responses/responseMessages.js';


const deleteMultipleFiles = async (files) => {


    return new Promise((resolve, reject) => {
        let i = files.length;

        files.forEach(function(filepath) {
            fs.unlink(`./${filepath}`, function(err) {
                i--;
                if (err && err.code == 'ENOENT') {
                    reject(new baseError(`Image ${responseMessages.IS_NOT_FOUND} for delete`, httpStatusCodes.BAD_REQUEST));
         
                } else if (err) {
                    // Error occuring during deleting the file, So reject the promise ...
                    reject(err);
                    return;
                } else if (i <= 0) {
                    // Everything goes write file deleted successfully
                    resolve();
                }
            });
        });

    })    

}

export default deleteMultipleFiles;