// asyncEventBus.js
const { EventEmitter } = require('events');

class AsyncEventBus extends EventEmitter {
    async emitAsync(eventName, payload) {
        const listeners = this.listeners(eventName);
        for (const listener of listeners) {
            // nếu listener trả về promise, await nó
            await listener(payload);
        }
    }
}

module.exports = new AsyncEventBus();
