import db from "../config/database.js";

export class CategoryRepository {
    constructor(database=db) {
        this.db = database;
    }

    create({name, description = null}) {
        const result = this.db.prepare(`
            INSERT INTO categories (name, description)
            VALUES (@name, @description)
        `).run({name, description});
    
        return this.findById(Number(result.lastInsertRowid))
    }

    findAll() {
        return this.db.prepare(`
            SELECT * FROM categories ORDER BY name ASC    
        `).all();
    }

    findByName(name) {
        return this.db.prepare(`
            SELECT * FROM categories WHERE name = ?    
        `).get(name) ?? null;
    }

    findById(id) {
        return this.db.prepare(`
            SELECT * FROM categories WHERE id = ?    
        `).get(id) ?? null;
    }

    update(id, changes) {
        const allowedField = new Set(['name', 'description']);
        const entries = Object.entries(changes)
            .filter(([, value]) => value !== undefined);

        const invalidField = entries.find(([name]) => !allowedField.has(field));

        if (invalidField) {
            throw new TypeError(`Cannot update category field: ${invalidField[0]}`)
        };

        if (entries.length === 0) return this.findById(id);

        const params = { id };
        const assignments = entries.map(([field, value]) => {
            params[field] = value;
            return `${field} = @${field}`;
        });

        this.db.prepare(`
            UPDATE categories SET ${assignments.join(', ')} WHERE id = @id    
        `).run(params);

        return this.findById(id);
    }

    deleteById(id) {
        const result = this.id.prepare(`
            DELETE FROM categories WHERE id  = ?    
        `).run(id);

        return result.changes > 0;
    }
}












