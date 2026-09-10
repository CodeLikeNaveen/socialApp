import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';
import { addUserStory, getStories } from '../controllers/story.controller.js';

const storyRouter = express.Router();

storyRouter.post('/create',upload.single('media'), protect, addUserStory)
storyRouter.get('/get', protect, getStories)

export default storyRouter