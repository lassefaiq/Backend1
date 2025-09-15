import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faPlane, faShieldAlt, faSmile } from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <>
            {/* Feature Section */}
            <div className="feature-section">
                <div className="feature-item">
                    <FontAwesomeIcon icon={faGlobe} className="feature-icon" />
                    <p>Gratis frakt och returer</p>
                </div>
                <div className="feature-item">
                    <FontAwesomeIcon icon={faPlane} className="feature-icon" />
                    <p>Expressfrakt</p>
                </div>
                <div className="feature-item">
                    <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
                    <p>Säkra betalningar</p>
                </div>
                <div className="feature-item">
                    <FontAwesomeIcon icon={faSmile} className="feature-icon" />
                    <p>Nyheter varje dag</p>
                </div>
            </div>

            {/*  Standard Footer (gömd på liten skärm) */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-column">
                        <h3>Shopping</h3>
                        <ul>
                            <li>Vinterjackor</li>
                            <li>Pufferjackor</li>
                            <li>Kappa</li>
                            <li>Trenchcoats</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Mina Sidor</h3>
                        <ul>
                            <li>Mina Ordrar</li>
                            <li>Mitt Konto</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Kundtjänst</h3>
                        <ul>
                            <li>Returnpolicy</li>
                            <li>Integritetspolicy</li>
                        </ul>
                    </div>
                </div>
                <p className="footer-bottom">© Freaky Fashion</p>
            </footer>

            {/*  Accordion Footer (syns bara på liten skärm) */}
            <div className="accordion-footer">
                <details>
                    <summary>Shopping</summary>
                    <ul>
                        <li>Vinterjackor</li>
                        <li>Pufferjackor</li>
                        <li>Kappa</li>
                        <li>Trenchcoats</li>
                    </ul>
                </details>

                <details>
                    <summary>Mina Sidor</summary>
                    <ul>
                        <li>Mina Ordrar</li>
                        <li>Mitt Konto</li>
                    </ul>
                </details>

                <details>
                    <summary>Kundtjänst</summary>
                    <ul>
                        <li>Returnpolicy</li>
                        <li>Integritetspolicy</li>
                    </ul>
                </details>

                <p className="footer-bottom">© Freaky Fashion</p>
            </div>
        </>
    );
}

export default Footer;
