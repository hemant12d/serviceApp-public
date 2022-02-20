// Load Environmental Variable
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const App = express();

import fileUpload from 'express-fileupload';

import appConfig from './App/config/appConfig.js';
import expressFileUploadConfig from './App/config/expressFileUploadConfig.js';

// Middleware
import globalErrorHandling from './App/controllers/errorController.js';

// Middleware to accept data from Apis
App.use( express.json() );
App.use( express.urlencoded({ extended: false }) );


// Enabling fileupload
App.use( fileUpload( expressFileUploadConfig ) );


// Application routes
import authenticationRoute from "./routes/authentication.js";
import userRoute from "./routes/user.js";
import serviceRoute from "./routes/service.js";
import subServiceRoute from "./routes/subService.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import addressRoute from "./routes/address.js";
import orderRoute from "./routes/checkout.js";


// Mouting routes
App.use(`/${appConfig.PREFIX}auth`, authenticationRoute);
App.use(`/${appConfig.PREFIX}users`, userRoute);
App.use(`/${appConfig.PREFIX}service`, serviceRoute);
App.use(`/${appConfig.PREFIX}sub-service`, subServiceRoute);
App.use(`/${appConfig.PREFIX}product`, productRoute);
App.use(`/${appConfig.PREFIX}cart`, cartRoute);
App.use(`/${appConfig.PREFIX}address`, addressRoute);
App.use(`/${appConfig.PREFIX}order`, orderRoute);


App.post("/home", (req, res) => {
  console.log(req.files)
  return res.send("Hello from home");
});

// Application global error handling middleware that handles all the errors
App.use(globalErrorHandling)

// Enable public files for accessing
App.use('/uploads', express.static(`./uploads`));

// Unhandled Route
App.get("*", (req, res)=>{
  return res.send("Route is not found");
});


export default App;




