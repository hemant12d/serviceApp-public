import fs from 'fs';
import Product from "../models/product.js"
import baseError from "../utils/baseError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import httpStatusCodes from "../responses/httpStatusCodes.js";
import responseMessages from "../responses/responseMessages.js";
import appConfig from "../config/appConfig.js";
import factoryController from './factoryController.js';
import uploadFileToPath from '../utils/uploadFileToPath.js';
import deleteMultipleFiles from '../utils/deleteMultipleFiles.js';


const productController = {

    create: factoryController.createOne(
        Product,
        {
            uploadLocation: 'product/',
            keyName_To_Request_And_Database: 'images',
            multiple: true,
        }
    ),

    getAll: factoryController.getAll(Product),

    getOne: factoryController.getOne(Product),

    updateOne: catchAsyncError(async function(req, res, next){

        const productDoc = await Product.findById(req.params.id);

        if(!productDoc)
            return next(new baseError(responseMessages.NOT_FOUND, httpStatusCodes.NOT_FOUND));

        let doc;
        let images = req.files.images;

        // Check if cover image is empty or not
        if(!images) {
            doc = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    runValidators: true
                }
            );
            return res.status(httpStatusCodes.ACCEPTED).send(doc);
        }

        // If multiple option is true, but client upload the single file then put single file to array for iterate
        if(!(images instanceof Array)){
            let arr = [];
            arr.push(images);
            images = arr;
        }

        // Update path to database
        req.body.images = await uploadFileToPath(images, 'product/', true);

        await deleteMultipleFiles(productDoc.images);

        // Update service
        let updateDoc = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                runValidators: true
            }
        );
        return res.status(httpStatusCodes.ACCEPTED).send(updateDoc);


        // fs.unlink(oldImagePath, async function(err) {
        //     if(err && err.code == 'ENOENT') 
        //         return next(new baseError(responseMessages.NOT_FOUND_TO_REMOVE, httpStatusCodes.NOT_FOUND));
            

        //     else if (err)
        //         // other errors, e.g. maybe we don't have enough permission
        //         return next(new baseError(`${responseMessages.NOT_ABLE} delete`, httpStatusCodes.SERVICE_ERROR));
                     
        //     else{                     
        //         // save file to server
        //         // await icon.mv(uploadFolder);
    
        //         // Update service
        //         let updateDoc = await Service.findByIdAndUpdate(req.params.id, req.body);
        //         return res.status(httpStatusCodes.ACCEPTED).send(updateDoc);
        //     }
 
        // });
    
    }),

    deleteOne: factoryController.deleteOne(Product),

    deleteAll: factoryController.deleteAll(Product),

}

export default productController;