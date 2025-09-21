const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


const imagesDir = path.resolve(__dirname, "..", "public", "images");
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
app.use("/images", express.static(imagesDir));


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const safe = (file.originalname || "upload")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage });

/* ---------- Helpers ---------- */
function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

app.get("/products", (req, res) => {
  const { category, search } = req.query;

  let sql = `
    SELECT p.*,
           c.slug  AS category_slug,
           c.name  AS category_name,
           c.image AS category_image
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


app.get("/products/slug/:slug", (req, res) => {
  const { slug } = req.params;
  db.get(
    `SELECT p.*,
            c.slug  AS category_slug,
            c.name  AS category_name,
            c.image AS category_image
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


app.post("/products", upload.single("image"), (req, res) => {
  const { name, sku, description, price, category_id } = req.body;

  if (!name || !sku || !description || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!category_id) {
    return res.status(400).json({ error: "Missing category_id" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Missing image file" });
  }

  const slug = slugify(name);
  const imagePath = `/images/${req.file.filename}`;

  const sql = `
    INSERT INTO products (name, sku, description, price, image, slug, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    name,
    sku,
    description,
    Number(price),
    imagePath,
    slug,
    Number(category_id),
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("❌ Error inserting product:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Product added", id: this.lastID, slug, image: imagePath });
  });
});


app.get("/categories", (req, res) => {
  db.all(
    "SELECT id, name, slug, image FROM categories ORDER BY name",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/categories", upload.single("image"), (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Missing name" });
  if (name.length > 25) return res.status(400).json({ error: "Name too long (max 25)" });
  if (!req.file) return res.status(400).json({ error: "Missing image file" });

  const slug = slugify(name);
  const imagePath = `/images/${req.file.filename}`;

  db.run(
    `INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)`,
    [name, slug, imagePath],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, slug, image: imagePath });
    }
  );
});

/* ---------- Start server ---------- */
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

