import express from "express";
import { signup } from "../Controller/auth.controller.js";
import {signin} from "../Controller/auth.controller.js"
import {google} from "../Controller/auth.controller.js"
const router = express.Router();
router.post("/signup", signup);// added new route for signup api
router.post("/signin", signin); // added new route for signin api
router.post("/google", google); // added new route for google signin api
export default router;
