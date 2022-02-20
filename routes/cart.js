import express from 'express';
const router = express.Router();

import cartController from '../App/controllers/cartController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";

// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js';


// Category Api endpoints
router.route("/")
.post(authenticator, cartController.create)
.get(authenticator, accessController(appRouteAccess.accessRead), cartController.getAll);

// User Cart
router.route("/mycart").get(authenticator, cartController.myCart);
router.route("/remove-from-cart/:id").get(authenticator, cartController.removeFromCart);


export default router;