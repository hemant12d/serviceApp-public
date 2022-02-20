import express from 'express';
const router = express.Router();

import addUserId from '../App/utils/addUserId.js';
import checkoutController from '../App/controllers/checkoutController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";


// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js'

router.use(authenticator);

// Category Api endpoints
router.route("/")
.post(addUserId, checkoutController.placeOrder)
.get(checkoutController.myOrder)
.patch(checkoutController.updateOrderStatus);

// router.route("/:id")
// .patch(checkout.update)
// .delete(checkout.deleteOne);


export default router;