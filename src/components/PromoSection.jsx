// src/components/PromoSection.jsx
export default function PromoSection() {
  return (
    <div className="promo-section">
      <div className="promo-card">
        <img src="/src/assets/gullit.webp" alt="Gullit" className="promo-image" />
        <img src="/src/assets/gullitstats.png" alt="Gullit Stats" className="overlay overlay-left" />
      </div>

      <div className="promo-card">
        <img src="/src/assets/zlatan.jpg" alt="Zlatan" className="promo-image" />
        <img src="/src/assets/thegoat.png" alt="GOAT" className="overlay overlay-bottom" />
      </div>

      <div className="promo-card">
        <img src="/src/assets/cruyf.jpg" alt="Cruyff" className="promo-image" />
        <img src="/src/assets/cruyffarrow.png" alt="Cruyff Arrow" className="overlay overlay-right" />
      </div>
    </div>
  );
}
