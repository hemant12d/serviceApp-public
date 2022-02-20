import catchAsyncError from '../utils/catchAsyncError.js';
import baseError from '../utils/baseError.js';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import countDocument from '../utils/countDocument.js';
import ApiFeatures from '../utils/apiFeatures.js';
import appConfig  from '../config/appConfig.js';
import getBaseUrl from '../utils/getBaseUrl.js';
import pageHandler from '../utils/pageHandler.js';
import uploadFileToPath from '../utils/uploadFileToPath.js';

const factoryController = {

    createOne: (Model, uploadfile=false) => {
        return catchAsyncError(async (req, res, next) => {

            // if File exists
            if(uploadfile){

                // check if file presend or not 
                if(Object.keys(req.files).length === 0 && req.files.constructor === Object)
                    return next(
                        new baseError(
                            `${uploadfile.keyName_To_Request_And_Database} ${responseMessages.IS_REQUIRED}`,
                            httpStatusCodes.BAD_REQUEST
                        )
                )
                
                // Check if files is present at mention fields or not 
                if(!req.files[uploadfile.keyName_To_Request_And_Database])
                    return next(
                        new baseError(
                            `${uploadfile.keyName_To_Request_And_Database} ${responseMessages.IS_REQUIRED}`,
                            httpStatusCodes.BAD_REQUEST
                        )
                )

                
                // Get file from Request
                let file = req.files[uploadfile.keyName_To_Request_And_Database];

                // If multiple option is true, but client upload the single file then put single file to array for iterate
                if(uploadfile.multiple){
                    if(!(file instanceof Array)){
                        let arr = [];
                        arr.push(file);
                        file = arr;
                    }
                }

                // If multiple option is false but client upload multiple image then put file to object

                if(!uploadfile.multiple){
                    if(file instanceof Array){
                        return next(new baseError(responseMessages.UPLOAD_SINGLE_IMAGE, httpStatusCodes.BAD_REQUEST));
                    }
                }


                // Get image store location
                const imageUploadLocation = await uploadFileToPath(file, uploadfile.uploadLocation, uploadfile.multiple);
          
                // set path to request body to store to database
                req.body[uploadfile.keyName_To_Request_And_Database] = imageUploadLocation;
            }            

            // Create document
            const doc = await Model.create(req.body);
            return res.status(httpStatusCodes.CREATED).json(doc);

        })

    },

    deleteOne: Model => {

        return catchAsyncError(async (req, res, next) => {

            const doc = await Model.findByIdAndUpdate(
                req.params.id,
                {isActive: false},
                { runValidators: true }
            );

            if(!doc) return next(new baseError(
                responseMessages.NOT_FOUND,
                httpStatusCodes.NOT_FOUND
            ));

            return res.status(httpStatusCodes.NO_CONTENT).json();
        });

    },

    updateOne: Model => {

        return catchAsyncError(async (req, res, next) => {

            const doc = await Model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { runValidators: true }
            );

            if (!doc){
                return next(new baseError("Document not find for update", 404));
            }

            return res.status(httpStatusCodes.ACCEPTED).json(doc);
        });
    },

    getOne: (Model, populateOptions) => {

        return catchAsyncError(async (req, res, next) => {

            let query = Model.findById(req.params.id);

            if (populateOptions) query = query.populate(populateOptions);

            const doc = await query;

            if(!doc) return next(new baseError(
                responseMessages.NOT_FOUND,
                httpStatusCodes.NOT_FOUND
            ));
            
            return res.status(httpStatusCodes.ACCEPTED).json(doc);
        })
    },

    getAll: Model => {

        return catchAsyncError(async function(req, res, next){

            if(!req.query.page)
                req.query.page = 1;
            
            if(!req.query.limit)
                req.query.limit = appConfig.DOC_LIMIT;
            

            let page = req.query.page * 1;
            let limit = req.query.limit * 1;

            let previous = null, nextUrl = null;

            let apiFeatures = new ApiFeatures(Model.find(), req.query)
            .filter()
            .fields()
            .sort()
            .paginate();
            
            let docs = await apiFeatures.chainQuery;

            // count all the active document
            let count = await countDocument(Model, {isActive: true});

            
            // if (page > 1) then show previous url
            if(page > 1)
                previous = getBaseUrl()+pageHandler(req.originalUrl, page, 0);
                 

            // if there are more records then show next url
            if((limit * page) < count)
                nextUrl = getBaseUrl()+pageHandler(req.originalUrl, page, 1);
            

            return res.status(httpStatusCodes.ACCEPTED).json({
                previous,
                next: nextUrl,
                count,
                results: docs
            });

        })
    },

    deleteAll:  Model => {

        return catchAsyncError(async function(req, res, next){

            await Model.deleteMany({});

            return res.status(httpStatusCodes.ACCEPTED).json({
                message: responseMessages.DELETED_SUCCESSFUL
            });

        })
    },

}


export default factoryController;