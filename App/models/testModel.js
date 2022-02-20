import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../responses/responseMessages.js';
import appConfig from '../config/appConfig.js';

const testSchema = new Schema({
    name: {
        type: String,
        required: [true, `Name ${responseMessages.IS_REQUIRED}`],
        maxLength: [20, "Title can't be greater than 20 characters"],
    },
    reference: {
        type: mongoose.Schema.OjectId,
    },
},
{
  timestamps: true,
});


// Compile the category Schema
const Test = mongoose.model("Test", testSchema);

export default Test;