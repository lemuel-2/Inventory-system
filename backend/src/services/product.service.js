import { ProductRepository } from "../repositories/product.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { AppError } from "../utils/app-error.js";

export class ProductService {
    constructor({
        productRepository = new ProductRepository(), 
        categoryRepository = new CategoryRepository()
    } = {}) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    #validateId(id) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new AppError('Product ID must be a positive integer.', 400)
        };
    }

    #requiredText(value, field) {
        if (typeof value !== "string" || value.trim() === '') {
            throw new AppError(`${field} is required and must be non-empty text.`, 400)
        }
        return value.trim();
    }

    #validateNonNegativeInteger(value, field) {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new AppError(`${field} must be a non-negative integer.`, 400)
        };
    }

    #validateCategoryId(categoryId) {
        if (categoryId === null) return;
        if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
            throw new AppError(
                ` Category ID must be a positive integer or null `, 400
            );
        }

        if (!this.categoryRepository.findById(categoryId)) {
            throw new AppError(`Category not found`, 404);
        }
    }

    list() {
        return this.productRepository.findAll();
    }

    getById(id) {
        this.#validateId(id);

        const product = this.productRepository.findById(id);
        if (!product) throw new AppError("Product not found", 404);
        
        return product;
    }

    create(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            throw new AppError(`Product data must be an object`, 400)
        }

        const sku = this.#requiredText(input.sku, "SKU");
        const name = this.#requiredText(input.name, "Name");
        const unit = input.unit === undefined 
            ? "pcs" 
            : this.#requiredText(input.unit, "Unit");

        const description = input.description ?? null;
        const categoryId = input.category_id ?? null;
        const priceCents = input.price_cents ?? 0;
        const reorderLevel = input.reorder_level ?? 0;

        if (description !== null && typeof description !== "string") {
            throw new AppError(`Description must be a text or null`, 400)
        }

        this.#validateNonNegativeInteger(priceCents, "price in cents");
        this.#validateNonNegativeInteger(reorderLevel, "Reorder level");
        this.#validateCategoryId(categoryId);

        if (this.productRepository.findBySku(sku)) {
            throw new AppError("SKU already exists. ", 409)
        }

        return this.productRepository.create({
            sku, 
            name,
            description: description?.trim() || null,
            category_id: categoryId,
            price_cents: priceCents,
            reorder_level: reorderLevel,
            unit 
        });
    }

    update(id, changes) {
        const existing = this.getById(id);
        
        if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
            throw new AppError("Update data must be an object.", 400);
        }

        const allowedField = new Set([
            'sku',
            'name',
            'description',
            'category_id',
            'price_cents',
            'reorder_level',
            'unit'
        ]);


        const entries = Object.entries(changes)
            .filter(([, value]) => value !== undefined);

        for (const [field] of entries) {
            if (!allowedField.has(field)) {
                throw new AppError(`Cannot update product field: ${field}`, 400);
            }
        }

        if (entries.length === 0) return existing;
        const normalized = Object.fromEntries(entries);

        if ("sku" in normalized) {
            normalized.sku = this.#requiredText(normalized.sku, "SKU")
        }

        const duplicate = this.productRepository.findBySku(normalized.sku);

        if (duplicate && duplicate.id !== id) {
            throw new AppError("SKU already exists", 409)
        }

        if ('name' in normalized) {
            normalized.name = this.#requiredText(normalized.name, "Name")
        }

        if ('unit' in normalized) {
            normalized.unit = this.#requiredText(normalized.unit, "Unit")
        }

        if ('description' in normalized) {
            if (normalized.description !== null && typeof normalized.description !== "string") {
                throw new AppError("Description must be text or null", 400);
            }

            normalized.description = normalized.description?.trim() || null;
        }

        if ("price_cents" in normalized) {
            this.#validateNonNegativeInteger(normalized.price_cents, "price in cents");
        }

        if ("reorder_level" in normalized) {
            this.#validateNonNegativeInteger(normalized.reorder_level, "Reorder level");
        }

        if ("category_id" in normalized) {
            this.#validateCategoryId(normalized.category_id);
        }

        return this.productRepository.update(id, normalized);
    }

    deactivate(id) {
        this.getById(id);
        return this.productRepository.deactivate(id);
    }


}














