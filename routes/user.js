import express from "express";
const router = express.Router();

import userController from "../App/controllers/userController.js";
import accessController from "../App/middlewares/accessController.js";

import appRouteAccess from '../App/config/appRouteAccess.js';

// Middleware
import authenticator from "../App/middlewares/authenticator.js"
import addIdToParams from "../App/utils/addIdToParams.js";

// utils
import updateFile from "../App/utils/updateFile.js";




router.route('/')
.get(authenticator, accessController(appRouteAccess.accessRead), userController.getAll)

// User operation
router.route('/me')
.get(authenticator, addIdToParams, userController.getOne)
.patch(
    authenticator,
    addIdToParams,
    updateFile('profile', 'users/'),
    userController.updateOne
)
.delete(authenticator, addIdToParams, userController.deleteOne)

// Admin operations with user
// Keep this route in end
router.route("/:id")
.get(authenticator, accessController(appRouteAccess.accessRead), userController.getOne)
.patch(
    authenticator,
    accessController(appRouteAccess.accessUpdate),
    updateFile('profile', 'users/', true),
    userController.updateOne
    )
.delete(authenticator, accessController(appRouteAccess.accessRemove), userController.deleteOne);



export default router;
