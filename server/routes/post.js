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
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;

    if (!title || !description)
        res.status(400).json({ success: false, message: 'Field cannot empty' });

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN',
        };

        const postUpdateCondition = { _id: req.params.id, user: req.userId };

        updatedPost = await Post.findOneAndUpdate(
            postUpdateCondition,
            updatedPost,
            { new: true }
        );

        // User not authorised to update post or post not found
        if (!updatedPost)
            return res.status(401).json({
                success: false,
                message: 'Post not found or User not authorised',
            });

        res.json({
            success: true,
            message: 'Update success',
            post: updatedPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, user: req.userId };

        const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

        // User not authorised or post not found
        if (!deletedPost)
            return res.status(401).json({
                success: false,
                message: 'Post not found or User not authorised',
            });

        res.json({
            success: true,
            message: 'Delete success',
            post: deletedPost,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

export default router;
