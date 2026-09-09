import { createPostImageUrl } from "../config/imageKit.js";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";


// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images = req.files

        let image_urls = []
        if (images.length) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    return createPostImageUrl(image)
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({ success: true, message: "Post Created!!" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        // User connections and followings
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });

        res.json({ success: true, posts })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            return res.json({ success: true, message: 'Post unliked' });
        } 
        
        post.likes_count.push(userId)
        await post.save()
        res.json({ success: true, message: 'Post liked' });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}