import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/products")
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // radera produkt
    const handleDelete = (id) => {
        if (window.confirm("Är du säker på att du vill ta bort produkten?")) {
            axios.delete(`http://localhost:3001/products/${id}`)
                .then(() => {
                    setProducts((prev) => prev.filter(product => product.id !== id));
                })
                .catch(error => {
                    console.error("Fel vid borttagning av produkt:", error);
                    alert("Kunde inte ta bort produkten.");
                });
        }
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
                <Link to="/admin/products/new" className="new-product-button">Ny produkt</Link>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Namn</th>
                            <th>SKU</th>
                            <th>Pris</th>
                            <th>Åtgärder</th> {/* kolumn för att radera produkt*/}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.price} SEK</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Ta bort
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
