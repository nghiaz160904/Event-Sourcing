const pool = require('../db');
const eventBus = require('../eventBus');

eventBus.on('PostCreated', async (evt) => {
    const { author, title, content, createdAt } = evt.payload;
    await pool.query(
        `INSERT INTO post (id,author,title,content,created_at) 
        VALUES($1,$2,$3,$4,$5)`,
        [evt.aggregateId, author, title, content, createdAt]
    );
});

eventBus.on('PostDeleted', async (evt) => {
    const { deletedAt } = evt.payload;
    await pool.query(
        'UPDATE post SET deleted_at=$1 WHERE id=$2',
        [deletedAt, evt.aggregateId]
    );
});

eventBus.on('RestoredToIndex', async (evt) => {
    console.log('--- Restoring to index', evt.payload.eventIndex);
    const { eventIndex, restoredAt } = evt.payload;
    await pool.query('TRUNCATE post');
    const { rows } = await pool.query(
        'SELECT type, payload, aggregate_id FROM event_store WHERE id <= $1 ORDER BY id ASC',
        [eventIndex]
    );
    for (const row of rows) {
        console.log(`Replaying: ${row.type} id=${row.aggregate_id}`);
        await eventBus.emitAsync(row.type, {
            type: row.type,
            aggregateId: row.aggregate_id,
            payload: row.payload
        });
    }
});