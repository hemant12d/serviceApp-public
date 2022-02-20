import fs from 'fs';
import SubService from "../../models/services/subService.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import baseError from "../../utils/baseError.js";
import httpStatusCodes from "../../responses/httpStatusCodes.js";
import responseMessages from "../../responses/responseMessages.js";
import factoryController from '../factoryController.js';
import uploadFileToPath from '../../utils/uploadFileToPath.js';


const subServiceController = {

    create: factoryController.createOne(
        SubService,
        {
            uploadLocation: 'servicesUpload/subservice/',
            keyName_To_Request_And_Database: 'icon',
            multiple: false
        }
    ),

    getAll: factoryController.getAll(SubService),

    getOne: factoryController.getOne(SubService, {path: 'service', select: 'name icon -_id'}),

    updateOne: catchAsyncError(async function(req, res, next){

        const oldDocs = await SubService.findById(req.params.id);

        if(!oldDocs)
        return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND));

        let doc;
        const icon = req.files.icon;

        // Check if cover image is empty or not
        if(!icon) {
            doc = await SubService.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    runValidators: true
                }
            );
            return res.status(httpStatusCodes.ACCEPTED).send(doc);
        }


        // Update path to database
        req.body.icon = await uploadFileToPath(icon, 'servicesUpload/subservice/');

        // Remove old file ( type of image file )      
        const oldImagePath = "./"+oldDocs.icon;


        fs.unlink(oldImagePath, async function(err) {
            if(err && err.code == 'ENOENT') 
                return next(new baseError(responseMessages.NOT_FOUND_TO_REMOVE, httpStatusCodes.NOT_FOUND));
            

            else if (err)
                // other errors, e.g. maybe we don't have enough permission
                return next(new baseError(
                    responseMessages.NOT_ABLE_TO_DELETE,
                    httpStatusCodes.SERVICE_ERROR
                ));
                     
            else{                     
                // save file to server
                // await icon.mv(uploadFolder);
    
                // Update service
                let updateDoc = await SubService.findByIdAndUpdate(req.params.id, req.body);
                return res.status(httpStatusCodes.ACCEPTED).send(updateDoc);
            }
 
        });
    
    }),

    deleteOne: factoryController.deleteOne(SubService)

}

export default subServiceController;