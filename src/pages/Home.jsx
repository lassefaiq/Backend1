import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { FaRegHeart } from "react-icons/fa";

import HeroSection from "../components/HeroSection";
import PromoSection from "../components/PromoSection";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <HeroSection />
      <PromoSection />

      {/* Home Container */}
      <div className="home-container">
        <section className="categories">
          <h2>Våra T-shirts</h2>

          {/* 🔽 keep only Premier League products */}
          {(() => {
            const premierOnly = products.filter(
              (p) =>
                p.category_slug === "premier-league" ||
                (p.category && p.category.toLowerCase() === "premier league") ||
                p.category_id === 1
            );

            return (
              <div className="category-grid">
                {premierOnly.map((product) => (
                  <Link
                    to={`/products/${product.slug}`}
                    key={product.id}
                    className="category"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="category-image"
                    />
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">{product.price} SEK</p>
                    <div className="heart-icon">
                      <FaRegHeart />
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}
        </section>
      </div>
    </>
  );
}

export default Home;
