import fs from 'fs';
import Service from "../../models/services/service.js"
import catchAsyncError from "../../utils/catchAsyncError.js";
import httpStatusCodes from "../../responses/httpStatusCodes.js";
import baseError from "../../utils/baseError.js";
import responseMessages from "../../responses/responseMessages.js";
import fileFormatValidate from "../../utils/fileFormatValidate.js";
import imageFunctionality from "../../utils/imageFunctionality.js";
import appConfig from "../../config/appConfig.js";
import factoryController from '../factoryController.js';
import uploadFileToPath from '../../utils/uploadFileToPath.js';
const serviceController = {

    create: factoryController.createOne(
        Service,
        {
            uploadLocation: 'servicesUpload/service/',
            keyName_To_Request_And_Database: 'icon',
            multiple: false
        }
    ),

    getAll: factoryController.getAll(Service),

    getOne: factoryController.getOne(Service),

    updateOne: catchAsyncError(async function(req, res, next){

        const serviceDoc = await Service.findById(req.params.id);

        if(!serviceDoc)
        return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND));

        let doc;
        const icon = req.files.icon;

        // Check if cover image is empty or not
        if(!icon) {
            doc = await Service.findByIdAndUpdate(req.params.id, req.body);
            return res.status(httpStatusCodes.ACCEPTED).send(doc);
        }


        // Update path to database
        req.body.icon = await uploadFileToPath(icon, 'servicesUpload/service/');

        // Remove old file ( type of image file )      
        const oldImagePath = "./"+serviceDoc.icon;


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
                let updateDoc = await Service.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        runValidators: true
                    }
                );
                return res.status(httpStatusCodes.ACCEPTED).send(updateDoc);
            }
 
        });
    
    }),

    deleteOne: factoryController.deleteOne(Service),

    // deleteAll: async (req, res, next)=>{
    //     await Service.deleteMany({});
    // }

}

export default serviceController;