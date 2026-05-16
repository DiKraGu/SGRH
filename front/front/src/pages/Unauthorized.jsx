import { Link } from "react-router-dom";
import "../styles/auth.css";

function Unauthorized() {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-code">403</div>
                <h1>Accès refusé</h1>
                <p>
                    Vous n’avez pas les droits nécessaires pour accéder à cette page.
                </p>

                <Link to="/" className="auth-button">
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}

export default Unauthorized;