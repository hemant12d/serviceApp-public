import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../../responses/responseMessages.js';

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, responseMessages.SERVICE_FIELD_IS_REQUIRED],
        maxLength: [30, responseMessages.SERVICE_TITLE_LIMIT],
    },
    icon: {
        type: String,
        required: [true, responseMessages.ICON_IS_REQUIRD],
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
  timestamps: true,
});

serviceSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
}

serviceSchema.pre(/^find/, function(next){
    this.find({isActive: true})
    next();
});

// Compile the category Schema
const Service = mongoose.model("Service", serviceSchema);

export default Service;