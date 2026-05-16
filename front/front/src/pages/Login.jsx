import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(email, motDePasse);

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            if (data.role === "ADMIN") {
                navigate("/admin");
            } else if (data.role === "RH") {
                navigate("/rh");
            } else if (data.role === "EMPLOYE") {
                navigate("/employe");
            }
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-logo">SGRH</div>

                <h1 className="login-title">
                    Système de Gestion des Ressources Humaines
                </h1>

                <p className="login-subtitle">
                    Une plateforme professionnelle pour centraliser la gestion des employés,
                    des congés, des salaires et du recrutement.
                </p>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <h2>Connexion</h2>
                    <p>Accédez à votre espace sécurisé.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email professionnel</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemple@entreprise.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button type="submit" className="login-button">
                            Se connecter
                        </button>
                    </form>

                    <div className="login-footer">
                        © 2026 SGRH — Gestion RH sécurisée
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;