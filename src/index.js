const express = require('express');
const cors = require('cors');
require('dotenv').config();
const migrate = require('./migrate');
const postsRouter = require('./routes/posts');
require('./projections/postProjection');

async function start() {
    await migrate();
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/', postsRouter);
    app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

    const PORT = process.env.PORT || 4002;
    app.listen(PORT, () => console.log(`Service listening on port ${PORT}`));
}

start().catch(err => {
    console.error('Failed to start service', err);
    process.exit(1);
});