const express = require('express');
const router = express.Router();
const CreatePostCommand = require('../commands/createPostCommand');
const DeletePostCommand = require('../commands/deletePostCommand');
const RestoreAtIndexCommand = require('../commands/restoreAtIndexCommand');
const { handleCreatePost } = require('../handlers/createPostHandler');
const { handleDeletePost } = require('../handlers/deletePostHandler');
const { handleRestoreAtIndex } = require('../handlers/restoreAtIndexHandler');
const pool = require('../db');

// Create post
router.post('/posts', async (req, res) => {
    try {
        const createCmd = new CreatePostCommand(req.body);
        const post = await handleCreatePost(createCmd);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete post (compensating event)
router.delete('/posts/:id', async (req, res) => {
    try {
        const deleteCmd = new DeletePostCommand({ id: req.params.id });
        const result = await handleDeletePost(deleteCmd);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List posts (excluding deleted)
router.get('/posts/', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM post WHERE deleted_at IS NULL ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/snapshots/restore/:index', async (req, res) => {
    try {
        const eventIndex = parseInt(req.params.index, 10);
        const cmd = new RestoreAtIndexCommand({ eventIndex });
        const result = await handleRestoreAtIndex(cmd);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;