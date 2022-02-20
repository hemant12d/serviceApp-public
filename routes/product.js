import express from 'express';
const router = express.Router();

import productController from '../App/controllers/productController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";


// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js'

// Category Api endpoints
router.route("/").post(productController.create).get(productController.getAll);

// router.route('/deleteAll').get(productController.deleteAll);
router.route("/:id")
.get(authenticator, productController.getOne)
.patch(authenticator, accessController(appRouteAccess.accessUpdate), productController.updateOne)
.delete(authenticator, accessController(appRouteAccess.accessRemove), productController.deleteOne);


export default router;