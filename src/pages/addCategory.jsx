import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProduct.css"; 

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ange ett kategorinamn.");
    if (name.trim().length > 25) return alert("Max 25 tecken för namn.");
    if (!file) return alert("Välj en bild.");

    const form = new FormData();
    form.append("name", name.trim());
    form.append("image", file);

    try {
      await axios.post("http://localhost:3001/categories", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Kategori tillagd!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Kunde inte lägga till kategori.");
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Produkter</h2>
      </aside>

      <main className="admin-main">
        <h1>Ny kategori</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              type="text"
              name="name"
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Bild:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          <button type="submit">Lägg till</button>
        </form>
      </main>
    </div>
  );
};

export default AddCategory;
