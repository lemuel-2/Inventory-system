import db from "../../config/database.js";

db.prepare(`
    ALTER TABLE categories
    ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1
`).run();

console.log("Category is_active column added successfully.");