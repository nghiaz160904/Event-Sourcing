const express = require('express');
const router = express.Router();
const CreatePostCommand = require('../commands/createPostCommand');
const { handleCreatePost } = require('../handlers/createPostHandler');
const pool = require('../db');

// Tạo bài viết
router.post('/', async (req, res) => {
    try {
        const cmd = new CreatePostCommand(req.body);
        const post = await handleCreatePost(cmd);
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi tạo bài viết' });
    }
});

// Lấy bài viết
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM post ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết' });
    }
});

module.exports = router;