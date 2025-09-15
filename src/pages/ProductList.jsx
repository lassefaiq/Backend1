import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import "./Home.css"; 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        axios.get("http://localhost:3001/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="product-list">
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Hittade {filteredProducts.length} produkter
            </h2>

            <div className="product-grid">
                {filteredProducts.map(product => (
                    <Link
                        to={`/products/${product.slug}`}
                        key={product.slug}
                        className="product-card"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.price} SEK</p>
                        <div className="heart-icon">
                            <FaRegHeart />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
