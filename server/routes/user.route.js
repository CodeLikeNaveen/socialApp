import express from 'express';
import { acceptConnectionRequest, discoverUser, followUser, getUserConnections, getUserData, getUserProfiles, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';
import { getUserRecentMessages } from '../controllers/message.controller.js';

const userRouter = express.Router();


userRouter.get('/data', protect, getUserData)
userRouter.post('/update', upload.fields([
    {
        name: "profile",
        maxCount: 1
    },
    {
        name: "cover",
        maxCount: 1
    }
]), protect, updateUserData)

userRouter.post('/discover', protect, discoverUser)
userRouter.post('/follow', protect, followUser)
userRouter.post('/unfollow', protect, unfollowUser)
userRouter.post('/connect', protect, sendConnectionRequest)
userRouter.post('/accept', protect, acceptConnectionRequest)
userRouter.get('/connections', protect, getUserConnections)

userRouter.get('/profiles', getUserProfiles)
userRouter.get('/recent-messages',protect, getUserRecentMessages)


export default userRouter
