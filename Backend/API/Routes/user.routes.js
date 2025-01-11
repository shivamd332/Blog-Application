import express from "express";
import { deleteUser, getUser, getUsers, signoutUser, test, updateUser } from "../Controller/user.controller.js";
import { verifyToken } from "../Utils/verifyUser.js";
const router = express.Router();
router.get("/test", test);
router.put("/update/:userId",verifyToken, updateUser); //here we are  creating a new route so that updates made by user can be saved
router.delete('/delete/:userId',verifyToken,deleteUser);//here we are  creating a new route, to perform the delete functionality
router.post('/signout',signoutUser)//this route, help to perform the signout functionality
// userId show which user is updating
// verifyToken is function which first verify the user based on the token saved in cookie after updateuser in execute
router.get('/getusers',verifyToken,getUsers)// this route is for admin only
router.get('/:userId',getUser);// this route is used by anyone
export default router;
