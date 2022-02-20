import express from 'express';
const router = express.Router();

import serviceController from '../App/controllers/servicesController/serviceController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";


// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js'

// Category Api endpoints
router.route("/").post(serviceController.create).get(serviceController.getAll);

// router.route('/deleteAll').get(serviceController.deleteAll);

router.route("/:id")
.get(authenticator, serviceController.getOne)
.patch(authenticator, accessController(appRouteAccess.accessUpdate), serviceController.updateOne)
.delete(authenticator, accessController(appRouteAccess.accessRemove), serviceController.deleteOne);




export default router;