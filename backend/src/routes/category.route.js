import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";

export class CategoryRoutes {
    constructor({ controller = new CategoryController() } = {}) {
        this.router = Router();
        this.controller = controller;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get("/", this.controller.list);
        this.router.get("/:id", this.controller.getById);
        this.router.post("/", this.controller.create);
        this.router.patch("/:id", this.controller.update);
        this.router.delete("/:id", this.controller.delete);
    }

    getRouter() {
        return this.router;
    }
}