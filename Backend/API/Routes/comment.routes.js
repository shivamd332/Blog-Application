import express from 'express' 
import {verifyToken} from '../Utils/verifyUser.js'
import { createComment, deleteComment, editComment, getcomments, getPostComments, likeComment } from '../Controller/comment.controller.js';
const router=express.Router()
router.post('/commentcreation',verifyToken,createComment);
router.get('/getPostComments/:postId',getPostComments)
router.put('/likecomment/:commentId',verifyToken,likeComment)
router.put('/editcomment/:commentId',verifyToken,editComment)
router.delete('/deletecomment/:commentId',verifyToken,deleteComment)
router.get('/getcomments',verifyToken,getcomments)

export default router;