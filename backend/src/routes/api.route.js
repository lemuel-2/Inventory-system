import { Router } from "express";

import { CategoryRoutes } from "./category.route.js";
import { ProductRoutes } from "./product.route.js";
import { InventoryRoutes } from "./inventory.route.js";

export class ApiRoutes {
    constructor({
        productRoutes = new ProductRoutes(),
        categoryRoutes = new CategoryRoutes(),
        inventoryRoutes = new InventoryRoutes()
    } = {}) {
        this.router = Router();
        this.productRoutes = productRoutes;
        this.categoryRoutes = categoryRoutes;
        this.inventoryRoutes = inventoryRoutes;
        this.registerRoutes()
    }

    registerRoutes() {
        this.router.use("/products", this.productRoutes.getRouter());
        this.router.use("/categories", this.categoryRoutes.getRouter());
        this.router.use("/inventory", this.inventoryRoutes.getRouter());
    }

    getRouter() {
        return this.router;
    }
}