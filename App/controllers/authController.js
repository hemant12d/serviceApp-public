import catchAsyncError from '../utils/catchAsyncError.js';
import baseError from '../utils/baseError.js';
import responseMessages from '../responses/responseMessages.js';
import httpStatusCodes from '../responses/httpStatusCodes.js';
import User from '../models/user.js';
import moment from 'moment';
import create_Save_And_Send_Token from '../utils/create_Save_And_Send_Token.js';
import factoryController from './factoryController.js';
import generateRandomOtp from '../utils/generateRandomOtp.js';
const authController = {

    register: catchAsyncError( async (req, res, next) => {

          const { userName, password, email, phoneNo } = req.body;
  
          const newUser = {
            userName,
            password,
            email,
            phoneNo
          };

          if(req.body.role){
            newUser.role = req.body.role;
          }

          const saveUser = await User.create(newUser);

          create_Save_And_Send_Token(saveUser, res);     
        
         
    }),

    login: catchAsyncError( async (req, res, next)=>{

        // Input validation
        const {email_userName, password} = req.body;
  
        if(!email_userName)
        return next(new baseError(responseMessages.EMAIL_USERNAME_EMPTY, httpStatusCodes.BAD_REQUEST, "email_userName"))
  
        if(!password)
        return next(new baseError(responseMessages.PASSWORD_EMPTY, httpStatusCodes.BAD_REQUEST, "password"))
  
  
        // Find user with email or userName
        const loginUser = await User.findOne(
          { $or: [ {userName: email_userName}, {email: email_userName} ] }
        )
  
  
        // Check user existance
        if(!loginUser)
        return next(new baseError(responseMessages.EMAIL_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST, "email_userName"));
        
        // Match the password
        if(!(await loginUser.matchPassword(password, loginUser.password)))
          return next(new baseError(responseMessages.PASSWORD_NOT_MATCHED, httpStatusCodes.UNAUTHORIZED, "password"));

          
        //   Verify email
        // if (!loginUser.isEmailVarified) 
        // return next(new baseError(responseMessages.VERIFY_EMAIL, httpStatusCodes.BAD_REQUEST));
          
        // Generate the authentication token & send
        create_Save_And_Send_Token(loginUser, res);

    }),
  
    forgetPassword: catchAsyncError(async (req, res, next)=>{
  
      // Get email or user
  
      // Input validation
      const {email_userName} = req.body;
  
      if(!email_userName)
        return next(new baseError(responseMessages.EMAIL_USERNAME_EMPTY, httpStatusCodes.BAD_REQUEST, "email_userName"))
  
      // Find user with email or userName
      const loginUser = await User.findOne(
        { $or: [ {userName: email_userName}, {email: email_userName} ] }
      )
  
      // Check user existance
      if(!loginUser)
      return next(new baseError(responseMessages.EMAIL_USER_NOT_EXISTS, httpStatusCodes.BAD_REQUEST, "email_userName"));
  
      // Generate Reset Token
      const resetToken = loginUser.createPasswordResetToken();
  
      // Send token to the client via email
      return res.send("Password reset link send to client");
    }),

    logout: catchAsyncError(async (req, res, next)=>{

        const logoutUser = await User.findById(req.user._id);
        if(!logoutUser) return next(new baseError(responseMessages.USER_NOT_FOUND, httpStatusCodes.BAD_REQUEST));

        let tokenIndex = logoutUser.tokens.indexOf(req.jwtToken);

        // Removing the specified element from the array
        logoutUser.tokens.splice(tokenIndex, 1);

        await logoutUser.save();
        return next(new baseError(responseMessages.LOGOUT, httpStatusCodes.NO_CONTENT))
    }),

    generateLoginOtp: catchAsyncError(async (req, res, next)=>{

      const {phoneNo} = req.body;

      if(!phoneNo)
      return next(new baseError(responseMessages.MOBILE_NUM_IS_REQUIRED, httpStatusCodes.BAD_REQUEST))

      // Find user with email or userName
      let user = await User.findOne(
        {phoneNo: phoneNo}
      )

      // Check user existence
      if(!user){
        // Signup the user
        const newUser = {phoneNo: phoneNo};
        user = await User.create(newUser);
      }  
      

      // Generate login otp
      const otp = generateRandomOtp();
      
      // Save otp to database
      user.otp = otp;
      let ten_Min_In_Mili_Second = 1000 * 60 * 10;

      // Date.now() => returns the number of milliseconds since January 1, 1970.
      user.otpValidTime = Date.now() + ten_Min_In_Mili_Second;
      await user.save();

      // Send to user
      return res.status(httpStatusCodes.ACCEPTED).json({ otp, });

    }),
    loginViaOtp:catchAsyncError(async (req, res, next)=>{
      const {otp, phoneNo} = req.body;

      if(!otp)
      return next(new baseError(responseMessages.OTP_REQUIRED_FOR_LOGIN, httpStatusCodes.BAD_REQUEST));

      if(!phoneNo)
      return next(new baseError(responseMessages.MOBILE_NUM_IS_REQUIRED, httpStatusCodes.BAD_REQUEST));

      const loginUser = await User.findOne( {otp: otp, phoneNo: phoneNo} );

      // Check user existance
      if(!loginUser)
        return next(new baseError(
            responseMessages.INVALID_OTP,
            httpStatusCodes.BAD_REQUEST
        ));

      // check otp expire or not
      // getTime() => returns the number of milliseconds since January 1, 1970
      if(loginUser.otpValidTime.getTime() < Date.now())
        return next(new baseError(
          responseMessages.OTP_EXPIRED,
          httpStatusCodes.BAD_REQUEST
        ));

          
      // Remove otp from database
      loginUser.otp = null;
      loginUser.otpValidTime = null;
      await loginUser.save();

      // Generate the authentication token & send
      create_Save_And_Send_Token(loginUser, res);
    }),


  
}

export default authController;