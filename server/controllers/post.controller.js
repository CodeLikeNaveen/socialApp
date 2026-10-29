import { createPostImageUrl } from "../config/imageKit.js";
import Comment from "../models/Comments.model.js";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import redis from "../config/redis.js";


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

        // remove old feed posts
        try {
            await redis.del('feedPosts')
        } catch (error) {
            console.log("Error in delete feed cache: ",error);
        }

        res.json({ success: true, message: "Post Created!!" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
    try {

        try {
            const cacheValue = await redis.get('feedPosts');
            if (cacheValue) {
                console.log("Feed Post Cache used")
                return res.json({ success: true, posts:cacheValue});
            }
        } catch (error) {
            console.log("Error in cache feed: ",error)
        }

        // const { userId } = req.auth()
        // const user = await User.findById(userId)

        // // User connections and followings
        // const userIds = [userId, ...user.connections, ...user.following]
        // const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });


        const posts = await Post.find().populate('user').sort({ likes_count: -1, createdAt: -1 }).limit(30);

        try {
            await redis.set('feedPosts',JSON.stringify(posts));
        } catch (error) {
            console.log("Error in save cache feed: ",error)
        }

        return res.json({ success: true, posts })

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
        // remove old feed posts
        try {
            await redis.del('feedPosts')
        } catch (error) {
            console.log("Error in delete feed cache: ",error);
        }
        res.json({ success: true, message: 'Post liked' });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Comment Post
export const commentPost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, content } = req.body;

        const comment = await Comment.create({
            post: postId,
            user: userId,
            content: content,
        });

        res.json({ success: true, message: 'Comment Added' });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}