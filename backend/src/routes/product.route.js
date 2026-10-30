import { Router } from "express";
import { ProductController } from "../controller/product.controller";

export class ProductRoutes {
    constructor({ controller = new ProductController } = {}) {
        this.router = Router();
        this. controller = controller;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get("/", this.controller.list);
        this.router.get("/:id", this.controller.getById);
        this.router.post("/", this.controller.create);
        this.router.patch("/:id/deactivate", this.controller.deactivate);
    }

    getRouter() {
        return this.router;
    }
}