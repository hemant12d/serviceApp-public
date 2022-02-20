import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../responses/responseMessages.js';
import appConfig from '../config/appConfig.js';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, `Name ${responseMessages.IS_REQUIRED}`],
        maxLength: [70, "Name can't be greater than 40 characters"],
    },
    description: {
        type: String,
    },
    images: [{
        type: String,
        required: [true, `Image ${responseMessages.IS_REQUIRED}`],
    }],
    price:{
        type:Number,
        required: [true, `Price ${responseMessages.IS_REQUIRED}`],
    },
    rating:{
        type:Number,
        default: 4.5,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
  timestamps: true,
});

productSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
}

productSchema.pre(/^find/, function(next){
    this.find({isActive: true})
    next();
});

// Compile the category Schema
const Product = mongoose.model("Product", productSchema);

export default Product;