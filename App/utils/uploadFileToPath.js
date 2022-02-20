import baseError from './baseError.js';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import appConfig from '../config/appConfig.js';
import imageFunctionality from './imageFunctionality.js';
import fileFormatValidate from './fileFormatValidate.js';


/**
 * 
 * @param {File} file 
 * @param {String} path 
 * @param {Boolean} multiple 
 * @return {String} filePath
 */


const uploadFileToPath = async (file, path, multiple = false) => {

    return new Promise(async (resolve, reject) => {
        let filePath;
        let fileName;
        // console.log("file 📁", file)

        if (!multiple) {

            // Check if file image is empty or not
            if (!file) reject(new baseError(
                responseMessages.ICON_IMAGE_REQUIRED,
                httpStatusCodes.BAD_REQUEST
            ));

            // Validate the file
            if (!fileFormatValidate(file))
                reject(new baseError(
                    responseMessages.IMAGE_NOT_SUPPORTED,
                    httpStatusCodes.UNPROCESSABLE
                ));

            // Get the image extension
            const imgExtension = imageFunctionality.getImageExtension(file.mimetype);
            fileName = Date.now().toString() + file.md5;
            
            // Image move location
            filePath = appConfig.IMG_FOLDER + `${path}${fileName}` + imgExtension;

            // Move file to the folder
            await file.mv(filePath);
        }
        else {
            let pathArray = [];
            for (let image of file) {
                // Validate the file
                if (!fileFormatValidate(image)) {
                    reject(new baseError(
                        responseMessages.IMAGE_NOT_SUPPORTED,
                        httpStatusCodes.UNPROCESSABLE
                    ));
                }
                // Get the image extension
                const imgExtension = imageFunctionality.getImageExtension(image.mimetype);
                // Image move location
                filePath = appConfig.IMG_FOLDER + `${path}${image.md5}` + imgExtension;
                pathArray.push(filePath);
                // Move file to the folder
                await image.mv(filePath);
            }
            filePath = pathArray;
        }
        resolve(filePath);
    })
}


export default uploadFileToPath;