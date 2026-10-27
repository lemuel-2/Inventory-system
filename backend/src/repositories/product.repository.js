import db from "../config/database.js";

export class ProductRepository{
    constructor(database=db) {
        this.db = database;
    }

    findById(id) {
        return this.db.prepare(`
            SELECT
                p.*,
                c.name AS category_name
            FROM products AS p
            LEFT JOIN categories AS c
                ON c.id = p.category_id
            WHERE p.id = ?     
        `).get(id) ?? null;
    }

    findAll() {
        return this.db.prepare(`
            SELECT 
                p.*,
                c.name AS category_name
            FROM products AS p
            LEFT JOIN categories AS c
                ON c.id = category_id
            ORDER BY p.name ASC
        `).all();
    }

    findBySku(sku) {
        return this.db.prepare(`
            SELECT * FROM products WHERE sku = ?
        `).get(sku) ?? null;
    }
}
