import express from 'express';
const router = express.Router();

import adduserId from '../App/utils/addUserId.js';

import addressController from '../App/controllers/addressController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";


// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js'

router.use(authenticator);

// Category Api endpoints
router.route("/")
.post(adduserId, addressController.create)
.get(addressController.myAddresss)

router.route("/:id")
.patch(addressController.update)
.delete(addressController.deleteOne);


export default router;