import { BaseController } from "./base.controller";
import { ProductService } from "../services/product.service";

export class ProductController extends BaseController {
    constructor({productService = new ProductService()} = {}) {
        super();

        this.productService = productService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.deactivate = this.deactivate.bind(this);
    }

    list(req, res, next) {
        return this.execute(
            res, next, 200, () => this.productService.list()
        )
    }

    getById(req, res, next) {
        return this.execute(
            res, next, 200, () => this.productService.getById(req.params.id, "Product ID")
        );
    }

    create(req, res, next) {
        return this.execute(
            res, next, 200, () => this.productService.create(req.body)
        )
    }

    update(req, res, next) {
        return this.execute(
            res, next, 200, () => this.productServices.update(
                this.parseId(res.params.id, "Product ID"), req.body
            ) 
        )
    }

    deactivate() {
        return this.execute(
            res, next, 200, () => this.productService.deactivate(
                this.parseId(req.params.id, "Product ID")
            )
        );
    }
}

