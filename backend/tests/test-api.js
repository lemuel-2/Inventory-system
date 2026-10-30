import assert from "node:assert/strict";
import fs from "node:fs";
import Database from "better-sqlite3";
import express from "express";

import { ApiRoutes } from "../src/routes/api.route.js";
import { ProductRoutes } from "../src/routes/product.route.js";
import { CategoryRoutes } from "../src/routes/category.route.js";
import { InventoryRoutes } from "../src/routes/inventory.route.js";
import { ProductController } from "../src/controller/product.controller.js";
import { CategoryController } from "../src/controller/category.controller.js";
import { InventoryController } from "../src/controller/inventory.controller.js";
import { ProductRepository } from "../src/repositories/product.repository.js";
import { CategoryRepository } from "../src/repositories/category.repository.js";
import { InventoryRepository } from "../src/repositories/inventory.repository.js";
import { ProductService } from "../src/services/product.service.js";
import { CategoryService } from "../src/services/category.service.js";
import { InventoryService } from "../src/services/inventory.service.js";
import { ErrorMiddleware } from "../src/middleware/error.middleware.js";
import { AppError } from "../src/utils/app-error.js";

const db = new Database(":memory:");
db.exec(fs.readFileSync(new URL("../src/database/schema.sql", import.meta.url), "utf8"));

const productService = new ProductService({
    productRepository: new ProductRepository(db),
    categoryRepository: new CategoryRepository(db),
});
const categoryService = new CategoryService({
    categoryRepository: new CategoryRepository(db),
});
const inventoryService = new InventoryService({
    database: db,
    inventoryRepository: new InventoryRepository(db),
});

const api = new ApiRoutes({
    productRoutes: new ProductRoutes({
        controller: new ProductController({ productService }),
    }),
    categoryRoutes: new CategoryRoutes({
        controller: new CategoryController({ categoryService }),
    }),
    inventoryRoutes: new InventoryRoutes({
        controller: new InventoryController({ inventoryService }),
    }),
});

const app = express();
app.use(express.json());
app.use("/api", api.getRouter());
app.use((req, res, next) => next(new AppError("Route not found", 404)));
app.use(new ErrorMiddleware().handle);

const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}/api`;

async function call(method, path, body) {
    const response = await fetch(base + path, {
        method,
        headers: body === undefined ? {} : { "content-type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
}

try {
    const category = await call("POST", "/categories", { name: "Tools" });
    assert.equal(category.status, 200);
    const categoryId = category.body.data.id;

    const renamed = await call("PATCH", `/categories/${categoryId}`, { name: "Hardware" });
    assert.equal(renamed.status, 200);
    assert.equal(renamed.body.data.name, "Hardware");

    const product = await call("POST", "/products", {
        sku: "A1",
        name: "Widget",
        unit: "kg",
        price_cents: 0,
        reorder_level: 7,
        category_id: categoryId,
    });
    assert.equal(product.status, 200);
    assert.equal(product.body.data.unit, "kg");
    assert.equal(product.body.data.price_cents, 0);
    assert.equal(product.body.data.reorder_level, 7);
    const productId = product.body.data.id;

    const duplicateSku = await call("POST", "/products", { sku: "A1", name: "Copy" });
    assert.equal(duplicateSku.status, 409);

    const patched = await call("PATCH", `/products/${productId}`, {
        description: null,
        unit: "box",
    });
    assert.equal(patched.status, 200);
    assert.equal(patched.body.data.description, null);
    assert.equal(patched.body.data.unit, "box");

    const missingCategory = await call("PATCH", `/products/${productId}`, { category_id: 9999 });
    assert.equal(missingCategory.status, 404);

    const badId = await call("GET", "/products/abc");
    assert.equal(badId.status, 400);

    const stockIn = await call("POST", `/inventory/products/${productId}/stock-in`, { quantity: 10 });
    assert.equal(stockIn.status, 200);
    assert.equal(stockIn.body.data.product.stock_quantity, 10);

    const stockOut = await call("POST", `/inventory/products/${productId}/stock-out`, { quantity: 3 });
    assert.equal(stockOut.status, 200);
    assert.equal(stockOut.body.data.product.stock_quantity, 7);

    const adjusted = await call("POST", `/inventory/products/${productId}/adjustments`, { quantityChange: -2 });
    assert.equal(adjusted.status, 200);
    assert.equal(adjusted.body.data.product.stock_quantity, 5);

    const stock = await call("GET", `/inventory/products/${productId}/stock`);
    assert.equal(stock.status, 200);
    assert.equal(stock.body.data.stock_quantity, 5);

    const movements = await call("GET", `/inventory/products/${productId}/movements?limit=2`);
    assert.equal(movements.status, 200);
    assert.equal(movements.body.data.length, 2);

    const oversell = await call("POST", `/inventory/products/${productId}/stock-out`, { quantity: 100 });
    assert.equal(oversell.status, 409);

    const missingProduct = await call("GET", "/products/9999");
    assert.equal(missingProduct.status, 404);

    const notFound = await call("GET", "/nope");
    assert.equal(notFound.status, 404);

    new ApiRoutes();

    console.log("API flow OK");
} finally {
    server.close();
    db.close();
}
