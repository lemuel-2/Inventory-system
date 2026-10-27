import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../..");

const databaseDirectory = path.join(
    projectRoot,
    "database"
);

const databasePath = path.join(
    databaseDirectory,
    "inventory.db"
);

const schemaPath = path.join(
    __dirname,
    "..",
    "database",
    "schema.sql"
);

fs.mkdirSync(databaseDirectory, { recursive: true });

const db = new Database(databasePath);

try {
    db.pragma("foreign_keys = ON");
    db.pragma("journal_mode = WAL");
    db.pragma("busy_timeout = 5000");

    const schema = fs.readFileSync(schemaPath, "utf8");
    
    db.exec(schema);
    console.log("Database connected successfully.");
} catch(error) {
    db.close();
    throw error;
}

export default db;
















