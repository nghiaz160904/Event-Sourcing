const express = require('express');
const router = express.Router();
const RestoreAtIndexCommand = require('../commands/restoreAtIndexCommand');
const { handleRestoreAtIndex } = require('../handlers/restoreAtIndexHandler');

// Restore projection to a specific event index
router.post('/restore/:index', async (req, res) => {
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