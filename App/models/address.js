import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import responseMessages from '../responses/responseMessages.js';


const addressSchema = new Schema({
  name: {
    type: String,
    required: [true, responseMessages.NAME_IS_REQUIRED],
    minLength: [3, responseMessages.NAME_MIN_LIMIT],
    maxLength: [30, responseMessages.NAME_MAX_LIMIT]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required:[true, responseMessages.ADDRESS_BELONG_USER],
  },
  phoneNo: {
    type: String,        
    required: [true, `Phone no ${responseMessages.IS_REQUIRED}`],        
    validate: {
        validator(phoneNo) {
            const phoneNoRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i;
            return phoneNoRegex.test(phoneNo);
        },
        message: '{VALUE} is not a valid phone number.',
    },
  },
  pincode: {
    type: String,
    required: [true, responseMessages.PINCODE_IS_REQUIRED],
    maxLength: [6, responseMessages.PINCODE_MAX_LIMIT],
    minLength: [6, responseMessages.PINCODE_MIN_LIMIT],
  },
  locality: {
    type: String,
    maxLength: [200, responseMessages.LOCALITY_LIMIT],
  },
  address: {
    type: String,
    required: [true, responseMessages.ADDRESS_IS_REQUIRED],
    maxLength: [200, responseMessages.ADDRESS_MAX_LIMIT],
  },
  district: {
    type: String,
    required: [true, responseMessages.DISTRICT_IS_REQUIRED],
    minLength: [3, responseMessages.DISTRICT_MIN_LIMIT],
    maxLength: [40, responseMessages.DISTRICT_MAX_LIMIT],
  },
  state: {
    type: String,
    required: [true, responseMessages.STATE_IS_REQUIRED],
    minLength: [3, responseMessages.STATE_MIN_LIMIT],
    maxLength: [40, responseMessages.STATE_MAX_LIMIT],
  },
  altPhoneNo: {
    type: String,              
    validate: {
        validator(otherphoneNo) {
            const phoneNoRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i;
            return phoneNoRegex.test(otherphoneNo);
        },
        message: '{VALUE} is not a valid phone number.',
    },
  },
  addressType: {
    type: String,
    enum: ['home', 'work', "other"],
    default: 'home',
  },
  location: {
    lat: String,
    lag: String
  }
},{
    timestamps: true
});

// Compile Modal

const Address = mongoose.model('Address', addressSchema);
export default Address;