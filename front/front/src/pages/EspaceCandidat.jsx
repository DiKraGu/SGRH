import { useEffect, useState } from "react";
import {
    getOffresPubliques,
    postulerOffre,
    consulterStatutCandidature,
} from "../services/candidatService";
import "../styles/dashboard.css";

function EspaceCandidat() {
    const [offres, setOffres] = useState([]);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [showPostulerModal, setShowPostulerModal] = useState(false);

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        lettreMotivation: "",
        cv: null,
    });

    const [emailSuivi, setEmailSuivi] = useState("");
    const [statuts, setStatuts] = useState([]);

    useEffect(() => {
        fetchOffres();
    }, []);

    const fetchOffres = async () => {
        try {
            const data = await getOffresPubliques();

            const offresOuvertes = data.filter(
                (offre) => offre.statut === "OUVERTE"
            );

            setOffres(offresOuvertes);
        } catch (error) {
            console.error("Erreur chargement offres", error);
            setOffres([]);
        }
    };

    const resetForm = () => {
        setForm({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            lettreMotivation: "",
            cv: null,
        });
    };

    const handlePostuler = async (e) => {
        e.preventDefault();

        if (!selectedOffre) {
            alert("Aucune offre sélectionnée.");
            return;
        }

        if (!form.cv) {
            alert("Veuillez ajouter votre CV.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("offreId", selectedOffre.id);
            formData.append("nom", form.nom);
            formData.append("prenom", form.prenom);
            formData.append("email", form.email);
            formData.append("telephone", form.telephone);
            formData.append("lettreMotivation", form.lettreMotivation);
            formData.append("cv", form.cv);

            await postulerOffre(formData);

            alert("Votre candidature a été envoyée avec succès.");

            setShowPostulerModal(false);
            setSelectedOffre(null);
            resetForm();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Erreur lors de l'envoi de la candidature."
            );
        }
    };

    const handleConsulterStatut = async (e) => {
        e.preventDefault();

        if (!emailSuivi) {
            alert("Veuillez saisir votre email.");
            return;
        }

        try {
            const data = await consulterStatutCandidature(emailSuivi);
            setStatuts(data);

            if (data.length === 0) {
                alert("Aucune candidature trouvée pour cet email.");
            }
        } catch (error) {
            setStatuts([]);
            alert("Aucune candidature trouvée pour cet email.");
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    return (
        <div className="public-page">
            <header className="public-header">
                <div>
                    <h1>SGRH Carrières</h1>
                    <p>Découvrez nos opportunités et postulez en ligne.</p>
                </div>

                <a href="/" className="public-login-link">
                    Connexion interne
                </a>
            </header>

            <main className="public-content">
                <section className="career-hero">
                    <div>
                        <h2>Rejoignez notre équipe</h2>
                        <p>
                            Consultez les offres ouvertes, postulez directement et suivez
                            l’état de votre candidature.
                        </p>
                    </div>
                </section>

                <section className="section-card">
    <h2>Suivre ma candidature</h2>

    <p className="section-subtitle">
        Entrez votre email pour consulter l’état de vos candidatures.
    </p>

    <form onSubmit={handleConsulterStatut} className="filters-row">
        <input
            className="search-input"
            type="email"
            placeholder="Votre email..."
            value={emailSuivi}
            onChange={(e) => setEmailSuivi(e.target.value)}
        />

        <button className="action-button" type="submit">
            Consulter
        </button>
    </form>

    {statuts.length > 0 && (
    <div className="table-container">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Offre</th>
                    <th>Date soumission</th>
                    <th>Statut</th>
                </tr>
            </thead>

            <tbody>
                {statuts.map((candidature) => (
                    <tr key={candidature.id}>
                        <td>{candidature.offreTitre || "-"}</td>
                        <td>{formatDate(candidature.dateSoumission)}</td>
                        <td>
                            <span className="status-badge ACTIF">
                                {candidature.statut}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
</section>

                <section className="section-card">
                    <h2>Offres d'emploi disponibles</h2>
                    <p className="section-subtitle">
                        Offres publiées par le service RH.
                    </p>

                    <div className="offers-grid">
                        {offres.map((offre) => (
                            <div key={offre.id} className="offer-card">
                                <div className="offer-header">
                                    <h3>{offre.titre}</h3>
                                    <span className="status-badge ACTIF">
                                        {offre.statut}
                                    </span>
                                </div>

                                <p className="offer-description">
                                    {offre.description}
                                </p>

                                <div className="offer-meta">
                                    <span>
                                        <strong>Département :</strong>{" "}
                                        {offre.departementNom || "-"}
                                    </span>

                                    <span>
                                        <strong>Poste :</strong>{" "}
                                        {offre.posteLibelle || "-"}
                                    </span>

                                    <span>
                                        <strong>Contrat :</strong>{" "}
                                        {offre.typeContrat || "-"}
                                    </span>

                                    <span>
                                        <strong>Salaire proposé :</strong>{" "}
                                        {offre.salairePropose
                                            ? `${offre.salairePropose} DH`
                                            : "-"}
                                    </span>

                                    <span>
                                        <strong>Date publication :</strong>{" "}
                                        {formatDate(offre.datePublication)}
                                    </span>

                                    <span>
                                        <strong>Date limite :</strong>{" "}
                                        {formatDate(offre.dateLimite)}
                                    </span>
                                </div>

                                <button
                                    className="action-button"
                                    onClick={() => {
                                        setSelectedOffre(offre);
                                        setShowPostulerModal(true);
                                    }}
                                >
                                    Postuler à cette offre
                                </button>
                            </div>
                        ))}

                        {offres.length === 0 && (
                            <div className="empty-state">
                                Aucune offre ouverte actuellement.
                            </div>
                        )}
                    </div>
                </section>

                
            </main>

            {showPostulerModal && selectedOffre && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Postuler</h2>
                                <p>{selectedOffre.titre}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowPostulerModal(false);
                                    setSelectedOffre(null);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handlePostuler} className="form-grid">
                            <div className="form-field">
                                <label>Nom</label>
                                <input
                                    value={form.nom}
                                    onChange={(e) =>
                                        setForm({ ...form, nom: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Prénom</label>
                                <input
                                    value={form.prenom}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            prenom: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Téléphone</label>
                                <input
                                    value={form.telephone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            telephone: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Lettre de motivation</label>
                                <textarea
                                    rows="5"
                                    value={form.lettreMotivation}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lettreMotivation: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>CV</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cv: e.target.files[0],
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Envoyer ma candidature
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowPostulerModal(false);
                                        setSelectedOffre(null);
                                        resetForm();
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EspaceCandidat;