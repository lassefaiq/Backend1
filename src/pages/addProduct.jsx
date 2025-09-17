import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    category_id: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Could not load categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({
      ...fd,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) return alert("Välj en produktbild.");
    if (!formData.category_id) return alert("Välj en kategori.");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("sku", formData.sku);
    data.append("price", formData.price);
    data.append("category_id", formData.category_id);
    data.append("image", imageFile); // <-- the file

    try {
      await axios.post("http://localhost:3001/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Produkt tillagd!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Kunde inte lägga till produkten.");
    }
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
            Bild:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
