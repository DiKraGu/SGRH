import { useEffect, useState } from "react";
import {
    getProfilConnecte,
    updateProfilConnecte,
} from "../services/profilService";
import "../styles/dashboard.css";

function ProfilModal({ onClose }) {
    const [profil, setProfil] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        email: "",
        nouveauMotDePasse: "",
    });

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const data = await getProfilConnecte();
                setProfil(data);
                setForm({
                    email: data.email || "",
                    nouveauMotDePasse: "",
                });
            } catch (error) {
                console.error("Erreur chargement profil", error);
                alert("Erreur lors du chargement du profil.");
                onClose();
            } finally {
                setLoading(false);
            }
        };

        fetchProfil();
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedProfil = await updateProfilConnecte({
                email: form.email,
                nouveauMotDePasse: form.nouveauMotDePasse,
            });

            localStorage.setItem("email", updatedProfil.email);
            alert("Profil mis à jour avec succès.");

            onClose();
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Erreur modification profil.");
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-card">
                    <p>Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (!profil) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card large">
                <div className="modal-header">
                    <div>
                        <h2>Mon profil</h2>
                        <p>Informations du compte connecté.</p>
                    </div>

                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="details-grid">
                    <p><strong>Email actuel :</strong> {profil.email}</p>
                    <p><strong>Rôle :</strong> {profil.role}</p>
                    <p><strong>Statut compte :</strong> {profil.statut ? "Actif" : "Inactif"}</p>
                    <p><strong>Employé lié :</strong> {profil.employeNomComplet || "Aucun"}</p>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={form.nouveauMotDePasse}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nouveauMotDePasse: e.target.value,
                                })
                            }
                            placeholder="Laisser vide si inchangé"
                        />
                    </div>

                    <div className="modal-actions full-width">
                        <button type="submit" className="action-button">
                            Enregistrer
                        </button>

                        <button
                            type="button"
                            className="action-button secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilModal;