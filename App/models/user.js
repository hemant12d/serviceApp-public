import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import appConfig from '../config/appConfig.js';
import responseMessages from '../responses/responseMessages.js';

// Template for user
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      minLength: [4, "fullName at least contain 4 characters"],
      maxLength: [15, "fullName can't be greater than 20 characters"],
    },
    email: {
      type: String,
      // It not throw an error, but convert the string to lower
      lowercase: true,
      // unique: [true, responseMessages.EMAIL_ALREADY_EXISTS],
      validate: {
        validator(email) {
          // eslint-disable-next-line max-len
          const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
          return emailRegex.test(email);
        },
        message: '{VALUE} is not a valid email.',
      },
    },
    userName: {
      type: String,
      unique: true,
      // It not throw an error, but convert the string to lower
      lowercase: true,

      // max & min properties won't work with number
      minLength: [4, "Username at least contain 4 characters"],
      maxLength: [15, "Username can't be greater than 15 characters"],
      validate: {
        validator: function (userName) {
          return (userName !== this.email);
        },
        message: "Username can't be same as email"
      }

    },
    phoneNo:{
        type: String,        
        required: [true, responseMessages.PHONE_NUM_IS_REQUIRED],        
        unique: true,
        validate: {
            validator(phoneNo) {
              // eslint-disable-next-line max-len
              const phoneNoRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i;
              return phoneNoRegex.test(phoneNo);
            },
            message: '{VALUE} is not a valid phone number.',
        },
    },
    profile: {
      type: String,
      default: 'uploads/defaultImages/defaultuser.png'
    },
    password: String,

    role: {
      type: String,
      enum: appConfig.APP_ROLES,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    otp:{
      type: String,
      minLength: [4, responseMessages.OTP_MIN_MAX_LIMIT],
      maxLength: [4, responseMessages.OTP_MIN_MAX_LIMIT],
    },
    countryCode:{
      type: Number,
      default: 91
    },
    otpValidTime:Date,
    tokens:[String],
    passwordChangeAt: Date,
    passwordResetToken:  String,
    passwordResetExpires: Date
  },
  {
    timestamps: true,
  }
);
   
// userSchema.set('toJSON', {
//   virtuals: true,
//   transform(doc, obj) {
   
//     delete obj.tokens;
//     return obj;
//   },
// });
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.isDeleted;
  delete obj.isEmailVarified;
  // delete obj.tokens;
  delete obj.role;
  delete obj.tokens;
  delete obj.password;
  delete obj.updatedAt;
  delete obj.otp;
  delete obj.otpValidTime;
  return obj;
}

// Increment the user password (Document pre M/W) 
userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();

  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  return next();
})

userSchema.pre(/^find/, function(next){
  this.find({isActive: true})
  next();
});


// Implement the password match functionality

/**
 * 
 * @param {String} password 
 * @param {String} hashPassword 
 * @returns {Boolean}
 */

// Note (Till now, this function only work with the query that fetch a single document)
userSchema.methods.matchPassword = async function(password, hashPassword){
  return await bcrypt.compare(password, hashPassword);
}


// Generate the reset Token
userSchema.methods.createPasswordResetToken = function(){
  
  // Generate the token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Output be Like => ec065ab4a37b300ad9c03141bb10ed497f09cd225d9064cd7d80cc05b40ef23d

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // Output be Like => 2184e84e5993f28a1419cf2ef9dde6ce02d62a4d5d724bc1d51c1f31faad8aaa

  // Please note that you need to specify a time to expire this token. In this example is (10 min)  

  let ten_MIN_IN_MILI_SECOND = 1000 * 60 * 10;
  this.passwordResetExpires = Date.now() + ten_MIN_IN_MILI_SECOND;

  return resetToken;
}


// Compile userSchema
// mongoose.models = {}

const userModel = mongoose.model("User", userSchema);
export default userModel;
