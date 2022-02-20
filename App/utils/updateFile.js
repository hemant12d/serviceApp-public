import baseError from "./baseError.js";
import removeFile from "./removeFile.js";
import uploadFileToPath from "./uploadFileToPath.js";
import catchAsyncError from "./catchAsyncError.js";
import User from '../models/user.js';
import responseMessages from "../responses/responseMessages.js";
import httpStatusCodes from "../responses/httpStatusCodes.js";

/**
 * 
 * @param {String} key ( key to find file in req.files & save file path to req.body's   property )
 * @param {String} path ( path file location to save file)
 * @returns 
 */
const updateFile = (key, path, getRemovePathFromUrlParmasId=false)=>{
    return catchAsyncError( async (req, res, next)=>{

        let oldFilePath;

        // If profile exists then upload
        if(req.files){                
            let file = req.files[key];

            if(getRemovePathFromUrlParmasId){
                let user = await User.findById(req.params.id);
                if(!user)
                    return next(new baseError(
                        "User not found",
                        httpStatusCodes.BAD_REQUEST
                    ))

                oldFilePath = user[key];
            }
            else{
                oldFilePath = req.user[key];
            }

            if(!file) next();

            // Upload file to location
            const saveImgPath = await uploadFileToPath(file, path);

            // If user already have profile, then delete previous
            if( oldFilePath && !(oldFilePath.includes('/defaultImages')) ){
                await removeFile(oldFilePath);
            }

            // Save new image path to body
            req.body[key] = saveImgPath;
        }
        next();

    })
}

export default updateFile;