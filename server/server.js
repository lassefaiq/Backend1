const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// hämtar alla produkter
app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// hämtar en singel produkt med slug
app.get("/products/slug/:slug", (req, res) => {
    const { slug } = req.params;
    db.get("SELECT * FROM products WHERE slug = ?", [slug], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Product not found" });
        res.json(row);
    });
});

// radera produkt med id
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

// lägger till ny produkt med ny slug
app.post("/products", (req, res) => {
    const { name, sku, description, price, image } = req.body;

    if (!name || !sku || !description || !price || !image) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // gör till slug namn
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

//  Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
