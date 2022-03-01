import express from 'express';
import { Post } from '../models/Post.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// @route GET api/posts
// @desc Get posts
// @access Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', [
            'username',
        ]);
        res.status(200).json({ success: true, message: 'Success', posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internet server error',
        });
    }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    //validation
    if (!title || !description)
        res.status(400).json({ success: false, message: 'Title is required' });

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId,
        });

        await newPost.save();

        res.json({ success: true, message: 'Happy', post: newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// @route PUT api/posts
// @desc Update post
// @access Private

// @route DELETE api/posts
// @desc Delete post
// @access Private

export default router;
