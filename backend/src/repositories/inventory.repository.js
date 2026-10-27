import db from "../config/database.js";

export class InventoryRepository{
    constructor(database=db) {
        this.db = database;
    }

    getStock(productId) {
        return this.db.prepare(`
            SELECT id, sku, name, stock_quantity, is_active FROM products WHERE id = ?
        `).get(productId) ?? null;
    }

    changesStockQuantity(product_id, quantityChange) {
        const result = this.db.prepare(`
            UPDATE products SET stock_quantity = stock_quantity + @quantityChange,
            updated_at = datetime('now')
            WHERE id = @productId AND stock_quantity + @quantityChange >= 0
        `).run(product_id, quantityChange);

        return result.changes > 0;
    }

    createMovement({productId, movementType, quantityChange, reason=null}) {
        const result = this.db.prepare(`
            INSERT INTO inventory_movements (
                product_id, 
                movement_type,
                quantity_change,
                reason
            )
            VALUES (@productId, @movementType, @quantity_change, @reason)    
        `).run({productId, movementType, quantityChange, reason});

        return this.findMovementById(Number(result.lastInsertRowid))
    }

    findMovementById(id) {
        return this.db.prepare(`
            SELECT * FROM inventory_movements WHERE id = ?
        `).get(id) ?? null;
    }

    findMovementsByProduct(productId, { limit = 50, offset = 0} = {}) {
        return this.db.prepare(`
            SELECT * FROM inventory_movements WHERE product_id = ?
            ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?    
        `).all(productId, limit, offset);
    }
}


















