import db from "../src/config/database.js";

try {
    const result = db.prepare(
        'SELECT sqlite_version() AS version'
    ).get();

    const tables = db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
        ORDER BY name
    `).all();

    console.log('SQLite_version: ', result.version)
    console.log('Database tables: ', tables)
} finally {
    db.close();
}