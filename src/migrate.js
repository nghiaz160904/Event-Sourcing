const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
    const dir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const sql = fs.readFileSync(path.join(dir, file), 'utf8');
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
    }

    console.log('Migrations completed.');
}

module.exports = runMigrations;