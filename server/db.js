const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to SQLite database");
});

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      image TEXT
    )
  `);

  
  db.all(`PRAGMA table_info(products)`, (err, cols) => {
    if (err) return console.error(err);
    const has = (n) => cols.some((c) => c.name === n);

    if (!has("sku"))         db.run(`ALTER TABLE products ADD COLUMN sku TEXT`);
    if (!has("slug"))        db.run(`ALTER TABLE products ADD COLUMN slug TEXT`);
    if (!has("category_id")) db.run(`ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES categories(id)`);
  });

  
  db.run(`CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)`);

  
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL,
      slug  TEXT NOT NULL UNIQUE,
      image TEXT
    )
  `);

  
  db.all(`PRAGMA table_info(categories)`, (err, cols) => {
    if (err) return console.error(err);
    const hasImage = cols.some((c) => c.name === "image");
    if (!hasImage) db.run(`ALTER TABLE categories ADD COLUMN image TEXT`);
  });
});

module.exports = db;
