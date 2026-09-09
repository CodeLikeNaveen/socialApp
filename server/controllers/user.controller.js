import { log } from "console";
import { createFileUrl } from "../config/imageKit.js";
import User from "../models/User.model.js"
import fs from 'fs';
import Connection from "../models/Connection.model.js";
import { inngest } from "../inngest/index.js";

// get user data
export const getUserData = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not Found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// find users using username email loacation name
export const discoverUser = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { input } = req.body

        const allUsers = await User.find({
            $or: [
                { username: new RegExp(input, i) },
                { email: new RegExp(input, i) },
                { full_name: new RegExp(input, i) },
                { loaction: new RegExp(input, i) },
            ]
        })

        const filterUsers = allUsers.filter(user => user._id !== userId);

        res.json({ success: true, users: filterUsers })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// update user data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = await req.auth()
        let { username, bio, loaction, full_name } = req.body;

        const userData = await User.findById(userId)

        !username && (username = userData.username)

        if (userData.username !== username) {
            const checkexist = await User.findOne({ username })
            if (checkexist) {
                username = userData.username
                // return res.json({success: false, message: "username already taken"})
            }
        }

        const updateData = { username, bio, loaction, full_name, }

        const profile = req.files?.profile?.[0]
        const cover = req.files?.cover?.[0]

        if (profile) {
            updateData.profile_picture = await createFileUrl(profile, '512');
        }
        if (cover) {
            updateData.cover_photo = await createFileUrl(cover, '1280');
        }

        const user = await User.findByIdAndUpdate(
            userId, { $set: updateData },
            { new: true }
        );

        res.json({ success: true, user, message: "Profile Updated Successfully" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// follow a user
export const followUser = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { id } = req.body

        const user = await User.findById(userId)

        if (user.following.includes(id)) {
            return res.json({ success: false, message: "Already following" })
        }

        user.following.push(id)

        await user.save()

        const toUser = await User.findById(id);
        toUser.followers.push(user._id)
        await toUser.save()



        res.json({ success: true, message: 'Following...' })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// unfollow a user
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { id } = req.body

        const user = await User.findById(userId)

        user.following = user.following.filter(user => user !== id)
        await user.save()

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(user => user !== userId)
        await toUser.save()

        res.json({ success: true, message: 'Unfollowing...' })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { id } = req.body

        // Check if user has sent more than 20 connection requests in the last 24 hours.
        const lastday = new Date(Date.now() - 86400000) // 24*60*60*1000
        const connectionRequests = await Connection.find({
            from_user_id: userId,
            createdAt: { $gt: lastday }
        })
        if (connectionRequests >= 20) {
            return res.json({ success: false, message: 'You reached the limit 20 Reqest in 24 Hours' })
        }

        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId },
            ]
        })

        if (!connection) {
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })

            // schedule story deletion after 24 hours
            await inngest.send({
                name: 'app/connection-request',
                data: { connectionId: newConnection._id }
            })

            res.json({ success: true, message: 'Connection Request Sent' })
        } else if (connection && connection.status === 'accepted') {
            return res.json({ success: false, message: 'Request Already Sent' })
        }
        res.json({ success: false, message: 'Connection Request Pending' })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// get user connections
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = await req.auth()

        const user = await User.findById(userId).populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({ to_user_id: userId, status: 'pending' }).populate('from_user_id')).map(connection => connection.from_user_id)

        res.json({ success: true, connections, followers, following, pendingConnections })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// accept connection request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { id } = req.body

        const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId })

        if (!connection) {
            return res.json({ success: false, message: "connection not found" })
        }

        const user = await Connection.findById(userId);
        user.connection.push(id);
        await user.save();

        const user2 = await Connection.findById(id);
        user2.connection.push(userId);
        await user2.save();

        connection.status = "accepted";
        await connection.save()

        res.json({ success: true, message: 'Connection accepeted successfully' })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// get other user profile
export const getUserProfiles = async (req, res) => {
    try {
        const { profileId } = req.body

        const profile = await User.findById(profileId)

        if (!profile) {
            return res.json({ success: false, message: "Profile not found" })
        }

        const posts = await Posts.find({ user: profileId }).populate('user');

        res.json({ success: true, profile, posts })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

