import { BaseController } from "./base.controller.js";
import { CategoryService } from "../services/category.service.js"

export class CategoryController extends BaseController {
    constructor({ categoryService = new CategoryService() } = {}) {
        super();
        this.categoryService = categoryService;

        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    list(req, res, next) {
        return this.execute(
            res, next, 200, () => this.categoryService.list()
        );
    }

    getById(req, res, next) {
        return this.execute(
            res, next, 200, () => this.categoryService.getById(
                this.parseId(req.params.id, "Category ID")
            )
        );
    }

    create(req, res, next) {
        return this.execute(
            res, next, 200, () => this.categoryService.create(req.body)
        );
    }

    update(req, res, next) {
        return this.execute(
            res, next, 200, () => this.categoryService.update(
                this.parseId(req.params.id, "Category ID"), req.body
            )
        );
    }

    delete(req, res, next) {
        return this.execute(
            res, next, 200, () => this.categoryService.delete(
                this.parseId(req.params.id, "Category ID")
            )
        );
    }
}