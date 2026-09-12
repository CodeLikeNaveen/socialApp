import { createMessageFileUrl } from "../config/imageKit.js";
import Message from "../models/Message.model.js";

// create an empty object to store SS Event connections 
const connections = {};

// Controller function for the SSE endpoint
export const sseController = (req, res) => {
    const { userId } = req.params
    // console.log('New client connected : ', userId)

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client's response object to the connections object
    connections[userId] = res;

    // Send an initial event to the client
    res.write('log: Connected to SSE stream\n\n');

    // Handle client disconnection
    req.on('close', () => {
        // Remove the client's response object from the connections array
        delete connections[userId];
        // console.log('Client disconnected');
    })
}

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if (message_type === 'image') {
            media_url = await createMessageFileUrl(image)
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        })
        
        // Send message to to_user_id using SSE
        
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');
        
        if (connections[to_user_id]) {
            message.seen = true;
            await message.save();
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }
        
        res.json({ success: true, message })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

// get chat Messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;

        await Message.updateMany(
            {
                from_user_id: to_user_id,
                to_user_id: userId,
                seen: false
            },
            {
                $set: { seen: true }
            }
        );

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).populate('from_user_id to_user_id').sort({ createAt: -1 });



        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// get recent Messages
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();

        const messages = await Message.find({ to_user_id: userId }).populate('from_user_id to_user_id').sort({ createAt: -1 });

        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}