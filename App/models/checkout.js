import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../responses/responseMessages.js';

import appConfig from '../config/appConfig.js';

const CheckoutSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref:'User',
      required: [true, responseMessages.CHECKOUT_BELONG_TO_USER],
    },
    paymentType: {
      type: String,
      enum: appConfig.PAYMENT_ACCEPTED_TYPE,
      default: 'cod',
      required: [true, responseMessages.PAYMENT_TYPE_IS_REQUIRED],
    },
   
    isCompleted: {
        type: Boolean,
        default: false
    },
    orderType: {
      type: String,
      enum: {
        values: appConfig.ORDER_DELIVERY_TYPE,
        message: `{VALUE} is not supported. Supported values are ${appConfig.ORDER_DELIVERY_TYPE}`
      },
      default:'delivery',
      required:[true, responseMessages.ORDERTYPE_IS_REQUIRED]
    },
    onModel:{
      type: String,
      default: 'Product'
    },
    items:[
      {
        item: {
          type: Schema.ObjectId,
          refPath:'onModel',
          required: [true, responseMessages.CHECKOUT_MUST_HAVE_ITEM]
        },
        totalPrice: {
          type: Number,
          required: [true, 'Price is required']
        },
        totalQuantity:{
          type: Number,
          default: 1,
          required: [true, 'Quantity is required']
        },
        orderStatus: {
          type: String,
          enum: appConfig.ORDER_STATUS,
          default: 'pending'
        },
        type: {
          type: String,
          default: 'product'
        }
      }
    ],
    // itemQuantity:{
    //   type: Number,
    //   default: 1
    // },
    // itemTotalPrice:{
    //     type: Number,
    //     default: 0,
    //     required:[true, responseMessages.CART_ITEM_MUST_HAVE_TOTAL]
    // },
    // orderItem: [{
    //     type: Schema.ObjectId,
    //     ref:'Cart',
    //     required: [true, responseMessages.CHECKOUT_MUST_HAVE_ITEM],
    // }],
    address: {
      type: Schema.ObjectId,
      ref: 'Address',
      required: [true, 'Address field is required']
    }, 
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
CheckoutSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  delete obj.isDeleted;
  delete obj.createdAt;
  delete obj.isActive;
  return obj;
}

// Compile Modal
const Checkout = mongoose.model("Checkout", CheckoutSchema);

export default Checkout;