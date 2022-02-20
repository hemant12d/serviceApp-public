import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../responses/responseMessages.js';
import appConfig from '../config/appConfig.js';

const cartSchema = new Schema({
    type: {
        type: String,
        enum: ['product', 'service'],
        required: [true, "Type is required."],
        default: 'product'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Cart must be belong to user"], 
    },
    item:{
        type: mongoose.Schema.ObjectId,
        refPath: 'onModel',
        required: [true, "Cart must have item"],
    }, 
    onModel: {
        type: String,
        required: [true, "Reference of order can't be empty"],
        enum: ['SubService', 'Product'],
        default:'Product'
    },
    itemQuantity:{
        type: Number,
        default: 1
    },
    itemTotalPrice:{
        type: Number,
        default: 0,
        required:[true, responseMessages.CART_ITEM_MUST_HAVE_TOTAL]
    },
    isCheckout: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
{
  timestamps: true,
});

cartSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    delete obj.isDeleted;
    delete obj.createdAt;
    delete obj.isActive;
    return obj;
}


// Compile the category Schema
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;