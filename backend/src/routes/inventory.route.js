import { Router } from "express";
import { InventoryController } from "../controller/inventory.controller.js";

export class InventoryRoutes {
    constructor({ controller = new InventoryController() } = {}) {
        this.router = Router();
        this.controller = controller;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get("/products/:productId/stock", this.controller.getStock);
        this.router.get("/products/:productId/movements", this.controller.getMovementHistory);
        this.router.post("/products/:productId/stock-in", this.controller.stockIn);
        this.router.post("/products/:productId/stock-out", this.controller.stockOut);
        this.router.post("/products/:productId/adjustments", this.controller.adjustStock);
    }

    getRouter() {
        return this.router;
    }
}