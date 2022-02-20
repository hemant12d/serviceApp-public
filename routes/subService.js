import express from 'express';
const router = express.Router();

import subServiceController from '../App/controllers/servicesController/subServiceController.js';

// Middlewares
import authenticator from "../App/middlewares/authenticator.js";
import accessController from "../App/middlewares/accessController.js";


// Endpoint Access 
import appRouteAccess from '../App/config/appRouteAccess.js';

// Category Api endpoints
router.route("/").post(subServiceController.create).get(subServiceController.getAll);

router.route("/:id")
.get(authenticator, subServiceController.getOne)
.patch(authenticator, accessController(appRouteAccess.accessUpdate), subServiceController.updateOne)
.delete(authenticator, accessController(appRouteAccess.accessRemove), subServiceController.deleteOne);


export default router;