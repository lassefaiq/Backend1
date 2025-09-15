import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { FaRegHeart } from "react-icons/fa"; 


function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/products")
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    return (
        <>
            {/* hero sektion med 2 bilder */}
            <header className="hero-section">
            {/* vänster sida bild */}
            <div className="hero-left">
                <div className="hero-text">
                </div>
            </div>
  
            {/* höger sida bild */}
            <div className="hero-right"></div>
            </header>

            <div className="promo-section">
                <img src="/src/assets/gullit.webp" alt="Promo 1" className="promo-image" />
                <img src="/src/assets/zlatan.jpg" alt="Promo 2" className="promo-image" />
                <img src="/src/assets/cruyf.jpg" alt="Promo 3" className="promo-image" />
                <img src="/src/assets/thegoat.png" alt="Promo 4" className="promo-image promo-extra" />
                <img src="/src/assets/cruyffarrow.png" alt="Cruyff Arrow" className="promo-image promo-arrow" />
                <img src="/src/assets/gullitstats.png" alt="Gullit Stats" className="promo-image promo-stats" />
            </div>


            {/* Home Container */}
            <div className="home-container">
                <section className="categories">
                    <h2>Våra T-shirts</h2>
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
        </>
    );
}

export default Home;
        
  
 