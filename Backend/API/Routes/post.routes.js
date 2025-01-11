import express from 'express';
import { verifyToken} from '../Utils/verifyUser.js';
import { createPost,deletePost,getPosts,updatePost } from '../Controller/post.controller.js';
const router=express.Router();
router.post('/create',verifyToken,createPost);
router.get('/getposts',getPosts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)// this route delete the selected post from our DB
router.put('/updatepost/:postId/:userId',verifyToken,updatePost)// this route will simple update the post in our DB
export default router;