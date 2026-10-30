import db from "../config/database.js";

export class ProductRepository{
    constructor(database=db) {
        this.db = database;
    }

    create(product) {
        const result = this.db.prepare(`
            INSERT INTO products (
                sku, 
                name, 
                description, 
                category_id, 
                price_cents, 
                reorder_level, 
                unit
            )
            VALUES (
                @sku,
                @name,
                @description,
                @category_id,
                @price_cents,
                @reorder_level,
                @unit
            ) 
        `).run({
            sku: product.sku,
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            price_cents: product.price_cents,
            reorder_level: product.reorder_level,
            unit: product.unit
        });

        return this.findById(Number(result.lastInsertRowid));
    }

    update(id, changes) {
        const allowedField = new Set([
            'sku', 
            'name', 
            'description', 
            'category_id', 
            'price_cents', 
            'reorder_level', 
            'unit',
            'is_active'
        ]);

        const entries = Object.entries(changes)
            .filter(([, value]) => value !== undefined);

        for (const [field] of entries) {
            if (!allowedField.has(field)) {
                throw new TypeError(`Cannot update product field: ${field}`);
            }
        }

        if (entries.length === 0) {
            return this.findById(id);
        }

        const params = { id };

        const assignments = entries.map(([field, value]) => {
            params[field] = value;
            return  `${field} = @${field}`;
        });


        this.db.prepare(`
            UPDATE products SET ${assignments.join(', ')}, 
            updated_at = datetime('now') WHERE id = @id
        `).run(params);

        return this.findById(id);
    }

    deactivate(id) {
        this.db.prepare(`
            UPDATE products SET is_active = 0, 
            updated_at = datetime('now') WHERE id = ?
        `).run(id)

        return this.findById(id);
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
