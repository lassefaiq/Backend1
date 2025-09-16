const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET /products?category=<slug>&search=<term>
 * - Returns products (optionally filtered by category slug and/or search terms)
 * - Includes category_slug and category_name for each product
 */
app.get("/products", (req, res) => {
  const { category, search } = req.query;

  let sql = `
    SELECT p.*,
           c.slug AS category_slug,
           c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    sql += ` AND c.slug = ?`;
    params.push(category);
  }

  if (search && search.trim()) {
    const terms = (search.toLowerCase().match(/\w+/g) || []);
    if (terms.length) {
      sql += ` AND (` + terms.map(() => `LOWER(p.name) LIKE ?`).join(" OR ") + `)`;
      terms.forEach(t => params.push(`%${t}%`));
    }
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * GET /products/slug/:slug
 * - Single product by slug
 */
app.get("/products/slug/:slug", (req, res) => {
  const { slug } = req.params;
  db.get(
    `SELECT p.*,
            c.slug AS category_slug,
            c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ?`,
    [slug],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Product not found" });
      res.json(row);
    }
  );
});

/**
 * DELETE /products/:id
 * - Delete product by id
 */
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

/**
 * POST /products
 * - Create product (current version does not assign a category)
 */
app.post("/products", (req, res) => {
  const { name, sku, description, price, image } = req.body;

  if (!name || !sku || !description || !price || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // create slug from name (handling å, ä, ö)
  const slug = name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-");

  db.run(
    "INSERT INTO products (name, sku, description, price, image, slug) VALUES (?, ?, ?, ?, ?, ?)",
    [name, sku, description, price, image, slug],
    function (err) {
      if (err) {
        console.error("❌ Error inserting product:", err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log("✅ Product added with ID:", this.lastID);
      res.status(201).json({ message: "Product added", id: this.lastID, slug });
    }
  );
});

/**
 * GET /categories
 * - List categories (id, name, slug)
 */
app.get("/categories", (req, res) => {
  db.all(
    "SELECT id, name, slug FROM categories ORDER BY name",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

//  Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
