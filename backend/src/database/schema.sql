-- Product categories
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL UNIQUE, 
    name TEXT NOT NULL,
    description TEXT,

    category_id INTEGER,
    price_cents INTEGER NOT NULL DEFAULT 0
        CHECK (price_cents >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (stock_quantity >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 0
        CHECK (reorder_level >= 0),

    unit TEXT NOT NULL DEFAULT 'pcs',
    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),

    created_at TEXT NOT NULL DEFAULT(datetime('now')),
    updated_at TEXT NOT NULL DEFAULT(datetime('now')),

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


-- Inventory movements history
CREATE TABLE IF NOT EXISTS inventory_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,

    movement_type TEXT NOT NULL
        CHECK (
            movement_type IN ("stock_in", "stock_out", "adjustment")
        ),

    -- Positive means it increase, Negative means it decrease
    quantity_change INTEGER NOT NULL
        CHECK (
            (movement_type = 'stock in' AND quantity_change > 0)
            OR
            (movement_type = 'stock_out' AND quantity_change < 0)
            OR
            (movement_type = 'adjustment' and quantity_change != 0)
        ),

    reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime("now")),


    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
);


-- Indexes help find related records more efficiently.ABORT
CREATE INDEX IF NOT EXISTS idx_product_category_id
    ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_movement_product_created_at
    ON inventory_movements(product_id, created_at);




















