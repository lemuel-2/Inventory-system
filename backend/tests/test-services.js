import db from "../src/config/database.js";

import { CategoryService } from "../src/services/category.service.js";
import { ProductService } from "../src/services/product.service.js"
import { InventoryService } from "../src/services/inventory.service.js"

const productService = new ProductService();
const categoryService = new CategoryService();
const inventoryService = new InventoryService();

try {
    console.log("Products: ", productService.list());
    console.log("Categories: ", categoryService.list());

    const products = productService.list();

    if (products.length > 0) {
        console.log("stock:", inventoryService.getStock(products[0].id));
    }

    console.log("All service classes loaded successfully.");

} finally {
    db.close();
}