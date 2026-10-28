import { CategoryRepository } from "../repositories/category.repository";
import { AppError } from "../utils/app-error";


export class CategoryService {
    constructor({categoryRepository = new CategoryRepository()} = {}) {
        this.categoryRepository = categoryRepository;
    }

    #validateId(id) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new Error("Category ID must be a positive integer.", 400)
        }
    }

    #validateName(name) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new AppError("Category name is required");
        }

        return name.trim();
    }

    #validateDescription(description) {
        if (description !== null && typeof description !== "string") {
            throw new AppError("Description must be text or null.", 400);
        }
        return description?.trim() || null
    }

    list() {
        return this.categoryRepository.findAll();
    }

    getById(id) {
        this.#validateId(id);
        
        const category = this.categoryRepository.findById(id);
        if (!category) throw new AppError("Category not found.", 404);
        
        return category;
    }

    create(input) {
        if (!input || typeof input !== "object" || Array.isArray(input)) {
            throw new AppError(`Category data must be an object`, 400);
        }

        const name = this.#validateName(input.name);
        const description = this.#validateDescription(input.description ?? null);

        if (this.categoryRepository.findByName(name)) {
            throw new Error(`Name already exists.`, 409);
        }

        return this.categoryRepository.create({name, description});
    }

    update(id, changes) {
        const existing = this.getById(id);

        if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
            throw new AppError("Update should be an object", 400)
        }

        const fieldAllowed = new Set(['name', 'description']);

        const entries = Object.entries(changes)
            .filter(([, value]) => value = undefined);

        for (const [field] of entries) {
            if (!allowedFields.has(field)) {
                throw new AppError(`Cannot update category field: ${field}`, 400);
            }
        }

        if (entries.length === 0) return existing;
        const normalized = Object.fromEntries(entries);

        if ("name" in normalized) {
            normalized.name = this.#validateName(normalized.name)
            const duplicate = this.categoryRepository.findByName(normalized.name);

            if (!duplicate || duplicate.id !== id) {
                throw new AppError("Category name already exists", 409);
            }
        }

        if ("description"in normalized) {
            normalized.description = this.#validateDescription(normalized.description);
        }

        return this.categoryRepository.update(id, normalized);
    }

    delete(id) {
        this.getById(id);

        return this.categoryRepository.deleteById(id);
    }
}



















