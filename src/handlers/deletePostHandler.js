const pool = require('../db');
const eventBus = require('../eventBus');
const { PostDeleted } = require('../events/postEvents');

async function handleDeletePost(cmd) {
    const deletedAt = new Date().toISOString();
    const evt = new PostDeleted({ id: cmd.id, deletedAt });
    await pool.query(
        'INSERT INTO event_store (aggregate_id, type, payload) VALUES ($1, $2, $3)',
        [evt.aggregateId, evt.type, evt.payload]
    );
    await eventBus.emitAsync(evt.type, evt);
    return { id: cmd.id, deletedAt };
}
module.exports = { handleDeletePost };