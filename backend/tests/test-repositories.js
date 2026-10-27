import db from '../src/config/database.js';

import { InventoryRepository } from '../src/repositories/inventory.repository.js';
import { CategoryRepository } from '../src/repositories/category.repository.js';
import { ProductRepository } from '../src/repositories/product.repository.js';

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const inventoryRepository = new InventoryRepository();

try {
    console.log("Categories: ", categoryRepository.findAll());
    console.log("Products", productRepository.findAll());
    console.log("Product with ID 1: ", productRepository.findById(1));
    console.log("Stock for product id 1", inventoryRepository.getStock(1));
    console.log("Movements for product ID 1", inventoryRepository.findMovementById(1));
} finally {
    db.close();
}