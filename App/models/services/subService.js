import mongoose from 'mongoose';
import responseMessages from '../../responses/responseMessages.js';
const Schema = mongoose.Schema;

const subServiceSchema = new Schema({
    name: {
        type: String,
        required: [true, responseMessages.SUBSERVICE_FIELD_IS_REQUIRED],
        maxLength: [30, responseMessages.SUBSERVICE_TITLE_LIMIT],
    },
    description: {
        type: String,
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: [true, responseMessages.SUBSERVICE_MUST_BELONG_SERVICE]
    },
    price:{
        type:Number,
        required: [true, responseMessages.PRICE_IS_REQUIRED],
    },
    icon: {
        type: String,
        required: true,
    },
    isActive:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});


subServiceSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    delete obj.isActive
    return obj;
}

// Get only active subcategory
subServiceSchema.pre(/^find/, function(next){
    this.find({isActive: true})
    next();
});


// Compile the category Schema
const SubService = mongoose.model("SubService", subServiceSchema);

export default SubService;