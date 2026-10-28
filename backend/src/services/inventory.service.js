import db from "../config/database.js";
import { InventoryRepository } from "../repositories/inventory.repository.js";
import { AppError } from "../utils/app-error.js";

export class InventoryService {
    constructor({database = db, inventoryRepository = new InventoryRepository()} = {}) {
        this.database = database;
        this.inventoryRepository = inventoryRepository;
    }

    #validateProductId(productId) {
        if (!Number.isSafeInteger(productId) || productId <= 0) {
            throw new AppError(`Product ID must be a positive integer.`, 400);
        }
    }

    #validateQuantity(quantity) {
        if (!Number.isSafeInteger(quantity) || quantity <= 0) {
            throw new AppError("Quantity must be a positive integer", 400)
        }
    }

    #validateReason(reason) {
        if (reason !== null && typeof reason !== "string") {
            throw new AppError("Reason must be a text or null", 400)
        }

        return reason?.trim() || null;
    }

    stockIn(productId, quantity, reason = null) {
        this.#validateQuantity(quantity);

        return this.#applyMovement(
            productId,
            'stockIn',
            quantity,
            reason,
        );
    }

    stockOut(productId, quantity, reason = null) {
        this.#validateQuantity(quantity);

        return this.#applyMovement(
            productId,
            "stockOut",
            quantity,
            reason,
        );
    }

    adjustStock(productId, quantityChange, reason = null) {
        if (!Number.isSafeInteger(quantityChange) || quantityChange === 0) {
            throw new AppError("Stock adjustment must be non-zero integer");
        }

        return this.#applyMovement(
            productId,
            "adjustment",
            quantityChange,
            reason
        );
    }

    getStock(productId) {
        this.#validateProductId(productId);

        const product = this.inventoryRepository.getStock(productId);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        
        return product;
    }

    getMovementHistory(productId, { limit = 50, offset = 0} = {}) {
        this.#validateProductId(productId);

        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            throw new AppError("limit must be between 1 and 100.", 400)
        }

        if(!Number.isSafeInteger(offset) || offset < 0) {
            throw new AppError("Offset must be a non_negative integer");
        }

        this.getStock(productId);

        return this.inventoryRepository.findMovementsByProduct(productId, {limit, offset});
    }

    #applyMovement(productId, movementType, quantityChange, reason) {
        this.#validateProductId(productId);

        const normalizedReason = this.#validateReason(reason);
        const transaction = this.database.transaction(() => {
            const product = this.inventoryRepository.getStock(productId)
            
            if (!product) throw new AppError("Product not found.", 404);
            if (product.is_active !== 1) {
                throw new AppError("Cannot change stock for an inactive product", 409);
            }
            
            const changed = this.inventoryRepository.changeStockQuantity(productId, quantityChange);
            if(!changed) {
                throw new AppError("Insufficient stock for this operation");
            }
    
            const movement = this.inventoryRepository.createMovement({
                productId,
                movementType,
                quantityChange,
                reason: normalizedReason,
            });
    
            return {
                product: this.inventoryRepository.getStock(productId), movement
            };
        });
        return transaction();
    }


}