import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllCandidatures,
    updateCandidatureStatut,
} from "../services/candidatureService";
import "../styles/dashboard.css";
import HeaderUserActions from "../components/HeaderUserActions";

function CandidaturesRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [candidatures, setCandidatures] = useState([]);
    const [statutFilter, setStatutFilter] = useState("TOUS");

    const fetchCandidatures = async () => {
        try {
            const data = await getAllCandidatures();
            const sortedData = [...data].sort((a, b) => b.id - a.id);
            setCandidatures(sortedData);
        } catch (error) {
            console.error("Erreur chargement candidatures", error);
        }
    };

    useEffect(() => {
        fetchCandidatures();
    }, []);

    const filteredCandidatures = candidatures.filter((candidature) => {
        if (statutFilter === "TOUS") {
            return true;
        }

        return candidature.statut === statutFilter;
    });

    const handleExaminer = async (id) => {
        try {
            await updateCandidatureStatut(id, "EN_EXAMEN");
            fetchCandidatures();
        } catch (error) {
            console.error("Erreur changement statut candidature", error);
            alert("Erreur lors du passage de la candidature en examen.");
        }
    };

   const handleVoirCV = (cheminCV) => {
    if (!cheminCV) {
        alert("Aucun CV disponible.");
        return;
    }

    const cleanPath = cheminCV.startsWith("cv/")
        ? cheminCV.replace("cv/", "")
        : cheminCV;

    window.open(`http://localhost:8080/cv/${cleanPath}`, "_blank");
};

    const getStatutLabel = (statut) => {
        switch (statut) {
            case "RECUE":
                return "En attente";
            case "EN_EXAMEN":
                return "Examinée";
            case "RETENUE":
                return "Retenue";
            case "REFUSEE":
                return "Refusée";
            default:
                return statut;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh")}
                    >
                        Tableau de bord
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/employes")}
                    >
                        Employés
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/conges")}
                    >
                        Congés
                    </div>

                    <div
    className="sidebar-item"
    onClick={() => navigate("/rh/salaires")}
>
    Salaires
</div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/offres")}
                    >
                        Offres d'emploi
                    </div>

                    <div className="sidebar-item active">
                        Candidatures
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Candidatures</h1>
                        <p>Suivi et examen des candidatures reçues.</p>
                    </div>

                    <HeaderUserActions />
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Liste des candidatures</h2>
                            <p className="section-subtitle">
                                Le RH consulte les CV et marque les candidatures comme examinées.
                            </p>
                        </div>

                        <select
                            className="filter-select"
                            value={statutFilter}
                            onChange={(e) => setStatutFilter(e.target.value)}
                        >
                            <option value="TOUS">Toutes les candidatures</option>
                            <option value="RECUE">En attente</option>
                            <option value="EN_EXAMEN">Examinées</option>
                        </select>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Candidat</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Offre</th>
                                    <th>CV</th>
                                    <th>Statut</th>
                                    <th>Action RH</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCandidatures.map((candidature) => (
                                    <tr key={candidature.id}>
                                        <td>
                                            {candidature.prenom} {candidature.nom}
                                        </td>

                                        <td>{candidature.email}</td>

                                        <td>{candidature.telephone}</td>

                                        <td>{candidature.offreTitre}</td>

                                        <td>
                                            <button
    type="button"
    className="cv-button"
    onClick={() => handleVoirCV(candidature.cheminCV)}
>
    Voir CV
</button>
                                        </td>

                                        <td>
                                            <span className={`status-badge ${candidature.statut}`}>
                                                {getStatutLabel(candidature.statut)}
                                            </span>
                                        </td>

                                        <td>
                                            {candidature.statut === "RECUE" ? (
                                                <button
                                                    className="file-button"
                                                    onClick={() =>
                                                        handleExaminer(candidature.id)
                                                    }
                                                >
                                                    Examiner
                                                </button>
                                            ) : (
                                                <span className="text-muted">
                                                    Déjà examinée
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredCandidatures.length === 0 && (
                            <div className="empty-state">
                                Aucune candidature trouvée.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CandidaturesRH;