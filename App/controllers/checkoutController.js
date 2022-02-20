import Checkout from "../models/checkout.js";
import Cart from "../models/cart.js";
import baseError from "../utils/baseError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import httpStatusCodes from "../responses/httpStatusCodes.js";
import responseMessages from "../responses/responseMessages.js";
import appConfig from "../config/appConfig.js";
import factoryController from './factoryController.js';

const cartController = {

    placeOrder: catchAsyncError(async (req, res, next)=>{

        let order = req.body;

        if(req.body.items[0].type === 'service')
            req.body.onModel = 'Service'


        // Order validation 
            // ....

        // check order already placed or not
        // const isOrderExist = await Checkout.find(
        //     { orderItem: { $in: order.orderItem } },
        //     {multi: true}
        // )

        // if(isOrderExist.length > 0)
        //     return next(new baseError(responseMessages.ORDER_ALREADY_PLACED, httpStatusCodes.ACCEPTED));

        // Create User order
        const userOrder = await Checkout.create(order);

        // Checkout from cart
        await Cart.deleteMany({user: req.user._id});

        return res.status(httpStatusCodes.CREATED).json(userOrder);
    }),
    // placeOrder: catchAsyncError(async (req, res, next)=>{

    //     let order = req.body;

    //     // Order validation 
    //         // ....

    //     // check order already placed or not
    //     const isOrderExist = await Checkout.find(
    //         { orderItem: { $in: order.orderItem } },
    //         {multi: true}
    //     )

    //     if(isOrderExist.length > 0)
    //         return next(new baseError(responseMessages.ORDER_ALREADY_PLACED, httpStatusCodes.ACCEPTED));

    //     // Create User order
    //     const userOrder = await Checkout.create(order);

    //     // Checkout from cart
    //     await Cart.updateMany(
    //         { _id: { $in: order.orderItem } },
    //         { $set: { isCheckout : true } },
    //         {multi: true}
    //     );

    //     return res.status(httpStatusCodes.CREATED).json(userOrder);
    // }),

    myOrder: catchAsyncError(async (req, res, next)=>{

        // // Find User Order     
        // let userOrder = await Checkout.find({user: req.user._id})
        // .populate({path:'user', select:'email userName'}) 
        // .populate({path:'items.item', select:'-__v -createdAt'}) 
        // .populate({path:'address', select:'-__v -createdAt'}); 

        const aggregatePipeline = [
            {
                $match: {
                    user: req.user._id,
                    isCompleted: false
                }
            },
            {
                $lookup: { 
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$items'
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.item',
                    foreignField: '_id',
                    as: 'items.item'
                }
            },           
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'address',
                    foreignField: '_id',
                    as: 'address'
                }
            },
            {
                $project: {
                    // user: { $arrayElemAt: ['$user', 0] },
                    user: { 
                        firstName: '$user.fullName',
                        email: '$user.email'
                     },
                    address: { $arrayElemAt: ['$address', 0] },
                    'items.item': { $arrayElemAt: ['$items.item', 0] },
                    paymentType: '$paymentType',
                    isCompleted: '$isCompleted',
                    'items.totalPrice': '$items.totalPrice',
                    'items.totalQuantity': '$items.totalQuantity',
                    'items.orderStatus': '$items.orderStatus'
                }
            },
            {
                $group: {
                    _id: "$_id",
                    items: { "$push": "$items" },
                    user: { "$first": "$user" },
                    address: { "$first": "$address" },
                    subQuantity: { "$sum": "$items.totalQuantity"},
                    subTotal: { "$sum": "$items.totalPrice"}
                }
            }

            // {
            //     $project:{
            //         user: {
            //             email: '$user.email',
            //             userName: '$user.userName',
            //         },
            //         paymentType: '$paymentType',
            //         isCompleted: '$isCompleted',
            //         orderStatus: '$orderStatus',
            //         orderType: '$orderType',
            //         orderItem: {
            //                 _id: '$orderItem.item._id',
            //                 type: '$orderItem.product',
            //                 name: '$orderItem.item.name',
            //                 images: '$orderItem.item.images',
            //                 price: '$orderItem.item.price',
            //         },
            //         itemTotalPrice: '$orderItem.itemTotalPrice',
            //         itemQuantity: '$orderItem.itemQuantity',
            //         address: { $arrayElemAt: ['$address', 0] }
            //     }
            // }
        ]


        let userOrder = await Checkout.aggregate(aggregatePipeline); 

        // if(userOrder.length < 1)
        //     return next(new baseError(
        //         responseMessages.USER_DO_NOT_HAVE_ORDER,
        //         httpStatusCodes.NOT_FOUND
        //     ));
        
      
        // Now send the response to the client
        return res.status(httpStatusCodes.ACCEPTED).json({
            totalResults: userOrder.length, 
            userOrder
        });
    }),
    // myOrder: catchAsyncError(async (req, res, next)=>{

    //     // Find User Order     
    //     let userOrder = await Checkout.find({user: req.user._id})
    //     .populate({path:'item', select:'-__v -createdAt'}) 
    //     .populate({path:'address', select:'-__v -createdAt'}); 


    //     // let userOrder = await Checkout.aggregate(aggregatePipeline); 

    //     if(userOrder.length < 1)
    //         return next(new baseError(
    //             responseMessages.USER_DO_NOT_HAVE_ORDER,
    //             httpStatusCodes.NOT_FOUND
    //         ));
        
      
    //     // Now send the response to the client
    //     return res.status(httpStatusCodes.ACCEPTED).json({
    //         totalResults: userOrder.length, 
    //         userOrder
    //     });
    // }),
    // myOrder: catchAsyncError(async (req, res, next)=>{

    //     // Find User Order     
    //     // let userOrder = await Checkout.find({user: req.user._id}).populate({path:'orderItem', select:'-__v -createdAt'}); 

    //     const aggregatePipeline = [
    //         {
    //             $match: {
    //                 user: req.user._id,
    //                 isCompleted: false
    //             }
    //         },
    //         {
    //             $lookup: { 
    //                 from: 'users',
    //                 localField: 'user',
    //                 foreignField: '_id',
    //                 as: 'user'
    //             }
    //         },
    //         {
    //             $unwind: '$user'
    //         },
    //         {
    //             $lookup: { 
    //                 from: 'carts',
    //                 localField: 'orderItem',
    //                 foreignField: '_id',
    //                 as: 'orderItem'
    //             }
    //         },
    //         {
    //             $unwind: '$orderItem'
    //         },
    //         {
    //             $lookup: {
    //                 from: 'products',
    //                 localField: 'orderItem.item',
    //                 foreignField: '_id',
    //                 as: 'orderItem.item'
    //             }
    //         },
    //         {
    //             $unwind: '$orderItem.item'
    //         },
    //         {
    //             $lookup: {
    //                 from: 'addresses',
    //                 localField: 'address',
    //                 foreignField: '_id',
    //                 as: 'address'
    //             }
    //         },
    //         {
    //             $project:{
    //                 user: {
    //                     email: '$user.email',
    //                     userName: '$user.userName',
    //                 },
    //                 paymentType: '$paymentType',
    //                 orderStatus: '$orderStatus',
    //                 isCompleted: '$isCompleted',
    //                 orderType: '$orderType',
    //                 orderItem: {
    //                         _id: '$orderItem.item._id',
    //                         type: '$orderItem.product',
    //                         name: '$orderItem.item.name',
    //                         images: '$orderItem.item.images',
    //                         price: '$orderItem.item.price',
    //                 },
    //                 itemTotalPrice: '$orderItem.itemTotalPrice',
    //                 itemQuantity: '$orderItem.itemQuantity',
    //                 address: { $arrayElemAt: ['$address', 0] }
    //             }
    //         }
    //     ]

    //     let userOrder = await Checkout.aggregate(aggregatePipeline); 

    //     if(userOrder.length < 1)
    //         return next(new baseError(
    //             responseMessages.USER_DO_NOT_HAVE_ORDER,
    //             httpStatusCodes.NOT_FOUND
    //         ));
        
      
    //     // Now send the response to the client
    //     return res.status(httpStatusCodes.ACCEPTED).json({
    //         totalResults: userOrder.length, 
    //         userOrder
    //     });
    // }),

    updateOrderStatus: catchAsyncError( async (req, res, next)=>{

        const {orderId, orderItem} = req.body;

        // Validation
        if(!orderId)
            return next(new baseError(
                responseMessages.ORDER_ID_REQUIRED_TO_CANCEL_ORDER,
                httpStatusCodes.BAD_REQUEST
            ));

        if(!orderItem)
            return next(new baseError(
                responseMessages.ORDER_ITEM_IS_REQUIRED_TO_CANCEL_ORDER,
                httpStatusCodes.BAD_REQUEST
            ));


        // Performing referencing operation in array's object's Id ( nested object )
        let cancelOrder = await Checkout.findOneAndUpdate({
                user: req.user._id,
                _id: orderId,
                "items.item": orderItem
            },
            { 
                "$set": { "items.$.orderStatus": 'cancel' }
            }, // update order status
            { new: true },
        );

        if(!cancelOrder)
            return next(new baseError(
                responseMessages.ITEM_NOT_FOUND_TO_CANCEL,
                httpStatusCodes.BAD_REQUEST
            ))

        return res.status(httpStatusCodes.ACCEPTED).json(cancelOrder);
    }

    ),


    getAll: factoryController.getAll(Checkout)

}

export default cartController;