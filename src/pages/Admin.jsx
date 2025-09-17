import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null); // { id, name, slug } or null

  // dropdown state
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef(null);

  // load categories once
  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // fetch products (all or filtered by selected category)
  useEffect(() => {
    const params = selectedCat ? { category: selectedCat.slug } : {};
    axios
      .get("http://localhost:3001/products", { params })
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Error fetching products:", err));
  }, [selectedCat]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // delete product
  const handleDelete = (id) => {
    if (window.confirm("Är du säker på att du vill ta bort produkten?")) {
      axios
        .delete(`http://localhost:3001/products/${id}`)
        .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
        .catch((error) => {
          console.error("Fel vid borttagning av produkt:", error);
          alert("Kunde inte ta bort produkten.");
        });
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCat(cat); // null = show all
    setOpenCat(false);
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Administration</h2>
        <nav>
          <ul>
            <li><Link to="/admin/products">Produkter</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="admin-content">
        <h1>Produkter</h1>

        {/* Actions row */}
        <div className="admin-actions-row">
          <Link to="/admin/products/new" className="new-product-button">Ny produkt</Link>

          {/* Kategorier dropdown */}
          <div className={`category-dropdown ${openCat ? "open" : ""}`} ref={catRef}>
            <button
              type="button"
              className="category-toggle"
              onClick={() => setOpenCat((o) => !o)}
              aria-haspopup="true"
              aria-expanded={openCat}
            >
              {selectedCat ? `Kategorier: ${selectedCat.name}` : "Kategorier"}
              <span className="caret">▾</span>
            </button>

            <ul className="dropdown-menu" role="menu">
              <li>
                <button type="button" onClick={() => handleSelectCategory(null)}>
                  Alla produkter
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => handleSelectCategory(c)}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Namn</th>
              <th>SKU</th>
              <th>Pris</th>
              <th>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.price} SEK</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Inga produkter hittades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
