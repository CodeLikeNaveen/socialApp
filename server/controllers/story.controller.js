import { createStoryMediaUrl } from "../config/imageKit.js";
import { inngest } from "../inngest/index.js";
import Story from "../models/Story.model.js";
import User from "../models/User.model.js";


// Add User Story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, background_color } = req.body;
        const media = req.file
        let media_url = ''

        // upload media to imagekit
        if (media_type === 'image' || media_type === 'video') {
            media_url = await createStoryMediaUrl(media)
        }

        // create story
        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        })

        // schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: {storyId: story._id}
        })

        res.json({ success: true, message: 'Story Added!!' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Stories
export const getStories = async (req, res) => {
    try {
        // const { userId } = req.auth();
        // const user = await User.findById(userId)

        // // User connections and followings
        // const userIds = [userId, ...user.connections, ...user.following]

        // const stories = await Story.find({
        //     user: { $in: userIds }
        // }).populate('user').sort({ createdAt: -1 });
        const stories = await Story.find().populate('user').sort({ createdAt: -1 }).limit(15);

        res.json({ success: true, stories })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}