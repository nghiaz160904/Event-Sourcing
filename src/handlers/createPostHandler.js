const { v4: uuid } = require('uuid');
const pool = require('../db');
const eventBus = require('../eventBus');
const { PostCreated } = require('../events/postEvents');

async function handleCreatePost(cmd) {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const evt = new PostCreated({ id, author: cmd.author, title: cmd.title, content: cmd.content, createdAt });
    await pool.query(
        'INSERT INTO event_store (aggregate_id, type, payload) VALUES ($1, $2, $3)',
        [evt.aggregateId, evt.type, evt.payload]
    );
    await eventBus.emitAsync(evt.type, evt);
    return { id, author: cmd.author, title: cmd.title, content: cmd.content, createdAt };
}
module.exports = { handleCreatePost };