import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        // Fetch product med slug
        axios.get(`http://localhost:3001/products/slug/${slug}`)
            .then(response => {
                setProduct(response.data);

                // fetchar alla produkter för att hämta liknande produkter
                axios.get("http://localhost:3001/products")
                    .then(res => {
                        const filteredProducts = res.data.filter(p => p.slug !== slug);
                        const shuffled = filteredProducts.sort(() => Math.random() - 0.5);
                        setSimilarProducts(shuffled.slice(0, 3));
                    });
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });

    }, [slug]); //  rerun när slug ändras

    if (!product) {
        return <p>Loading product...</p>;
    }

    return (
        <div>
            <div className="product-details">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="description">{product.description}</p>
                    <p className="price">{product.price} SEK</p>
                    <button className="add-to-cart">Lägg i varukorg</button>
                </div>
            </div>

            <div className="similar-products">
                <h2>Liknande produkter</h2>
                <div className="similar-grid">
                    {similarProducts.map(similarProduct => (
                        <Link
                            to={`/products/${similarProduct.slug}`}
                            className="product-card"
                            key={similarProduct.id}
                        >
                            <img src={similarProduct.image} alt={similarProduct.name} />
                            <p>{similarProduct.name}</p>
                            <p>{similarProduct.price} SEK</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
