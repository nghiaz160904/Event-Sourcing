const pool = require('../db');
const eventBus = require('../eventBus');
const { v4: uuid } = require('uuid');
async function handleRestoreAtIndex(cmd) {
    // 1) Lấy giá trị lớn nhất trong event_store
    const { rows: maxRows } = await pool.query(
        'SELECT MAX(id) AS "maxId" FROM event_store'
    );
    const maxId = maxRows[0].maxId || 0;

    // 2) Nếu vượt, bắn lỗi dừng luôn
    if (cmd.eventIndex > maxId) {
        throw new Error(
            `Invalid restoreIndex: ${cmd.eventIndex}. Current max event_store id is ${maxId}.`
        );
    }
    // Truncate projection cũ
    const id = uuid();
    // Ghi lại hành động restore vào event_store
    const restoredAt = new Date().toISOString();
    const restoreEvt = {
        type: 'RestoredToIndex',
        aggregateId: id,
        payload: { eventIndex: cmd.eventIndex, restoredAt }
    };

    const result = await pool.query(
        'INSERT INTO event_store (aggregate_id, type, payload) VALUES ($1, $2, $3) RETURNING id',
        [restoreEvt.aggregateId, restoreEvt.type, restoreEvt.payload]
    );
    const restoreEventIndex = result.rows[0].id;

    await eventBus.emitAsync(restoreEvt.type, restoreEvt);

    return { restoredTo: cmd.eventIndex, restoreEventIndex, restoredAt };
}

module.exports = { handleRestoreAtIndex };