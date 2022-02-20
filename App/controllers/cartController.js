import Cart from "../models/cart.js"
import baseError from "../utils/baseError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import httpStatusCodes from "../responses/httpStatusCodes.js";
import responseMessages from "../responses/responseMessages.js";
import appConfig from "../config/appConfig.js";
import factoryController from './factoryController.js';
import subService from '../models/services/subService.js';
import Product from '../models/product.js';


const cartController = {

    create: catchAsyncError(async (req, res, next)=>{

        // Create cart       
        let type = appConfig.DEFAULT_CART_TYPE;
        let onModel = 'Product';
        let userCart;

        // Default type & reference
        if(req.body.type === 'service'){
            type = 'service',
            onModel = 'SubService'
        }

        let {itemPrice, itemQuantity, item} = req.body;

        // Check if item is belong to type or not
        if(type === 'service'){
            const serviceItem = await subService.findById(item);
            if(!serviceItem)
                return next(new baseError(
                    responseMessages.ITEM_NOT_BELONG_TO_SERVICE,
                    httpStatusCodes.BAD_REQUEST
                ));
        }
        else{
            const productItem = await Product.findById(item);
            if(!productItem)
                return next(new baseError(
                    responseMessages.ITEM_NOT_BELONG_TO_PRODUCT,
                    httpStatusCodes.BAD_REQUEST
                ));
        }

        // Default Item quantity
        if(!itemQuantity)
            itemQuantity = 1;
           
        // Validate the quantity
        if(!(itemQuantity*1))
            return next(new baseError(
                responseMessages.PROVIDE_VALID_QUANTITY,
                httpStatusCodes.BAD_REQUEST
            ));

        // Handle float quantity
        itemQuantity = Math.ceil(itemQuantity);

        // Validate the price
        if(!itemPrice || !(itemPrice * 1))
            return next(new baseError(
                responseMessages.ITEM_PRICE_PROVIDED_AND_VALID,
                httpStatusCodes.BAD_REQUEST
            ));

        // Check if user already have cart or not
        let cart = await Cart.findOne({
            item,
            user: req.user._id,
            isCheckout: false
        });

        if(!cart){
            const newCart = {
                type,
                user: req.user._id,
                item,
                itemQuantity: itemQuantity,
                itemTotalPrice:(itemPrice * itemQuantity),
                onModel 
            }

            userCart = await Cart.create(newCart);
        }

        else{
            cart.itemQuantity = itemQuantity;
            cart.itemTotalPrice = (itemQuantity * itemPrice)
            userCart = await cart.save();
        }

        // Send response to client
        return res.status(httpStatusCodes.CREATED).json(userCart);

    }),

    myCart: catchAsyncError(async (req, res, next)=>{

        // Find User Cart     
        let userCart = await Cart.find({
            user: req.user._id,
            isCheckout: false
        }).populate({path:'item', select:'-__v -createdAt'}); 

        if(userCart.length < 1)
            return next(new baseError(responseMessages.CART_EMPTY, httpStatusCodes.NOT_FOUND));
        
        // Calculate the total price & quantity
        let totalQuantity = 0, totalPrice = 0;

        for(let item of userCart){
            totalQuantity = totalQuantity + item.itemQuantity;
            totalPrice = totalPrice + item.itemTotalPrice;
        }
      
        // Now send the response to the client
        return res.status(httpStatusCodes.ACCEPTED).json({
            totalResults: userCart.length, 
            userCart,
            totalQuantity,
            totalPrice
        });
    }),
    removeFromCart: catchAsyncError(async (req, res, next)=>{

        // Find from cart & remove 
        let userCart = await Cart.findOneAndDelete({
            user: req.user._id,
            _id: req.params.id
        })

        // If cart not available to delete
        if(!userCart)
            return next(new baseError(
                responseMessages.ITEM_NOT_EXISTS_IN_CART_TO_REMOVE,
                httpStatusCodes.BAD_REQUEST
            ));
      
        // Now send the response to the client
        return res.status(httpStatusCodes.NO_CONTENT).json();
    }),

    getAll: factoryController.getAll(Cart)

}

export default cartController;