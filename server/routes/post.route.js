import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';
import { addPost, commentPost, getFeedPosts, likePost } from '../controllers/post.controller.js';

const postRouter = express.Router();

postRouter.post('/add',upload.array('images', 4), protect, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/comment', protect, commentPost)


export default postRouter