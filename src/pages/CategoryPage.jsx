// src/pages/CategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import "./Home.css"; // reuse your existing styles

const titleBySlug = {
  "premier-league": "Premier League",
  "vm": "VM",
  "sverige": "Sverige",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // fetch only this category
    axios
      .get(`http://localhost:3001/products?category=${slug}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="home-container">
      <section className="categories">
        <h2>{titleBySlug[slug] || "Kategorier"}</h2>
        <h3 style={{ marginTop: 6 }}>Hittade {products.length} produkter</h3>

        <div className="category-grid">
          {products.map(product => (
            <Link to={`/products/${product.slug}`} key={product.id} className="category">
              <img src={product.image} alt={product.name} className="category-image" />
              <p className="product-name">{product.name}</p>
              <p className="product-price">{product.price} SEK</p>
              <div className="heart-icon">
                <FaRegHeart />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
