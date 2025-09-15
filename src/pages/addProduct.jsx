import React, { useState } from "react";
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
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/products", formData)
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

                    <button type="submit">Lägg till</button>
                </form>
            </main>
        </div>
    );
};

export default AddProduct;
