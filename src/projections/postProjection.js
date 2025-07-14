const pool = require('../db');
const eventBus = require('../eventBus');

// Projection cho PostCreated
eventBus.on('PostCreated', async (evt) => {
    const { author, title, content, createdAt } = evt.payload;
    await pool.query(
        `INSERT INTO post (id, author, title, content, created_at) VALUES ($1, $2, $3, $4, $5)`,
        [evt.aggregateId, author, title, content, createdAt]
    );
});