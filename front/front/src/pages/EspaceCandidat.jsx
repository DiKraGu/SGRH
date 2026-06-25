import { useEffect, useMemo, useState } from "react";
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

    const [searchTerm, setSearchTerm] = useState("");
    const [posteFilter, setPosteFilter] = useState("TOUS");
    const [departementFilter, setDepartementFilter] = useState("TOUS");
    const [contratFilter, setContratFilter] = useState("TOUS");
    const [sortOption, setSortOption] = useState("DATE_RECENTE");

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

    const postesDisponibles = useMemo(() => {
        const postes = offres
            .map((offre) => offre.posteLibelle)
            .filter(Boolean);

        return [...new Set(postes)].sort();
    }, [offres]);

    const departementsDisponibles = useMemo(() => {
        const departements = offres
            .map((offre) => offre.departementNom)
            .filter(Boolean);

        return [...new Set(departements)].sort();
    }, [offres]);

    const offresFiltrees = useMemo(() => {
        let result = [...offres];

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((offre) => {
                const fullText = `
                    ${offre.titre || ""}
                    ${offre.description || ""}
                    ${offre.departementNom || ""}
                    ${offre.posteLibelle || ""}
                    ${offre.typeContrat || ""}
                `.toLowerCase();

                return fullText.includes(search);
            });
        }

        if (posteFilter !== "TOUS") {
            result = result.filter(
                (offre) => offre.posteLibelle === posteFilter
            );
        }

        if (departementFilter !== "TOUS") {
            result = result.filter(
                (offre) => offre.departementNom === departementFilter
            );
        }

        if (contratFilter !== "TOUS") {
            result = result.filter(
                (offre) => offre.typeContrat === contratFilter
            );
        }

        result.sort((a, b) => {
            switch (sortOption) {
                case "DATE_ANCIENNE":
                    return new Date(a.datePublication) - new Date(b.datePublication);

                case "SALAIRE_DESC":
                    return Number(b.salairePropose || 0) - Number(a.salairePropose || 0);

                case "SALAIRE_ASC":
                    return Number(a.salairePropose || 0) - Number(b.salairePropose || 0);

                case "DATE_LIMITE_PROCHE":
                    return new Date(a.dateLimite) - new Date(b.dateLimite);

                case "DATE_RECENTE":
                default:
                    return new Date(b.datePublication) - new Date(a.datePublication);
            }
        });

        return result;
    }, [
        offres,
        searchTerm,
        posteFilter,
        departementFilter,
        contratFilter,
        sortOption,
    ]);

    const resetFilters = () => {
        setSearchTerm("");
        setPosteFilter("TOUS");
        setDepartementFilter("TOUS");
        setContratFilter("TOUS");
        setSortOption("DATE_RECENTE");
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

                <section className="candidate-tracking-card">
                    <div className="candidate-tracking-header">
                        <div>
                            <h2>Suivre ma candidature</h2>
                            <p>
                                Entrez votre email pour consulter l’état de vos candidatures.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleConsulterStatut}
                        className="candidate-tracking-form"
                    >
                        <input
                            className="candidate-tracking-input"
                            type="email"
                            placeholder="Votre email..."
                            value={emailSuivi}
                            onChange={(e) => setEmailSuivi(e.target.value)}
                        />

                        <button
                            className="candidate-tracking-button"
                            type="submit"
                        >
                            Consulter
                        </button>
                    </form>

                    {statuts.length > 0 && (
                        <div className="candidate-status-results">
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
                    <div className="career-offers-header">
                        <div>
                            <h2>Offres d'emploi disponibles</h2>
                            <p className="section-subtitle">
                                {offresFiltrees.length} offre(s) trouvée(s) sur {offres.length} ouverte(s).
                            </p>
                        </div>
                    </div>

                    <div className="career-filters-card">
                        <div className="career-filters-grid">
                            <div className="career-filter-field">
                                <label>Recherche</label>
                                <input
                                    type="text"
                                    placeholder="Titre, poste, département..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="career-filter-field">
                                <label>Poste</label>
                                <select
                                    value={posteFilter}
                                    onChange={(e) => setPosteFilter(e.target.value)}
                                >
                                    <option value="TOUS">Tous les postes</option>

                                    {postesDisponibles.map((poste) => (
                                        <option key={poste} value={poste}>
                                            {poste}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="career-filter-field">
                                <label>Département</label>
                                <select
                                    value={departementFilter}
                                    onChange={(e) => setDepartementFilter(e.target.value)}
                                >
                                    <option value="TOUS">Tous les départements</option>

                                    {departementsDisponibles.map((departement) => (
                                        <option key={departement} value={departement}>
                                            {departement}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="career-filter-field">
                                <label>Contrat</label>
                                <select
                                    value={contratFilter}
                                    onChange={(e) => setContratFilter(e.target.value)}
                                >
                                    <option value="TOUS">Tous les contrats</option>
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="STAGE">STAGE</option>
                                </select>
                            </div>

                            <div className="career-filter-field">
                                <label>Trier par</label>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="DATE_RECENTE">
                                        Date publication : plus récent
                                    </option>
                                    <option value="DATE_ANCIENNE">
                                        Date publication : plus ancien
                                    </option>
                                    <option value="SALAIRE_DESC">
                                        Salaire : plus élevé
                                    </option>
                                    <option value="SALAIRE_ASC">
                                        Salaire : plus bas
                                    </option>
                                    <option value="DATE_LIMITE_PROCHE">
                                        Date limite : plus proche
                                    </option>
                                </select>
                            </div>

                            <div className="career-filter-actions">
                                <button
                                    type="button"
                                    className="career-reset-button"
                                    onClick={resetFilters}
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="offers-grid">
                        {offresFiltrees.map((offre) => (
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

                        {offresFiltrees.length === 0 && (
                            <div className="empty-state">
                                Aucune offre ne correspond aux filtres sélectionnés.
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