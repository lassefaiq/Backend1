import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    sku: "",
    price: "",
    category_id: "",     // ✅ new
  });

  const [categories, setCategories] = useState([]); // ✅ load categories

  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Could not load categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // store category_id as number
    setFormData((fd) => ({
      ...fd,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Välj en kategori innan du sparar.");
      return;
    }

    axios
      .post("http://localhost:3001/products", formData)
      .then(() => {
        alert("Produkt tillagd!");
        navigate("/admin");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Produkter</h2>
      </aside>

      <main className="admin-main">
        <h1>Ny produkt</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Beskrivning:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Bild (URL):
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            SKU:
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Pris:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          {/* ✅ Category tick box (single choice via radios) */}
          <fieldset className="category-field">
            <legend>Kategori</legend>
            <div className="category-options">
              {categories.map((c) => (
                <label key={c.id} className="category-option">
                  <input
                    type="radio"
                    name="category_id"
                    value={c.id}
                    checked={Number(formData.category_id) === c.id}
                    onChange={handleChange}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit">Lägg till</button>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
