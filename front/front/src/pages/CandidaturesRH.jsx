import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllCandidatures,
    updateCandidatureStatut,
} from "../services/candidatureService";
import "../styles/dashboard.css";

function CandidaturesRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [candidatures, setCandidatures] = useState([]);

    const fetchCandidatures = async () => {
        try {
            const data = await getAllCandidatures();
            setCandidatures(data);
        } catch (error) {
            console.error("Erreur chargement candidatures", error);
        }
    };

    useEffect(() => {
        fetchCandidatures();
    }, []);

    const handleChangeStatut = async (id, statut) => {
        try {
            await updateCandidatureStatut(id, statut);
            fetchCandidatures();
        } catch (error) {
            console.error("Erreur changement statut", error);
        }
    };

    const handleOpenCV = (cvPath) => {
        if (!cvPath) {
            alert("CV non disponible.");
            return;
        }

        const url = `http://localhost:8080/${cvPath}`;
        window.open(url, "_blank");
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div className="sidebar-item" onClick={() => navigate("/rh")}>
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

                    <div className="sidebar-item">Salaires</div>

                    <div className="sidebar-item active">Recrutement</div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Candidatures</h1>
                        <p>Suivi et traitement des candidatures reçues.</p>
                    </div>

                    <div className="dashboard-user">{email}</div>
                </div>

                <div className="section-card">
                    <h2>Liste des candidatures</h2>

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
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {candidatures.map((candidature) => (
                                    <tr key={candidature.id}>
                                        <td>
                                            {candidature.prenom} {candidature.nom}
                                        </td>

                                        <td>{candidature.email}</td>

                                        <td>{candidature.telephone}</td>

                                        <td>{candidature.offreTitre}</td>

                                        <td>
                                            <button
                                                className="file-button"
                                                onClick={() =>
                                                    handleOpenCV(candidature.cheminCV)
                                                }
                                            >
                                                Voir CV
                                            </button>
                                        </td>

                                        <td>
                                            <span className={`status-badge ${candidature.statut}`}>
                                                {candidature.statut}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    onClick={() =>
                                                        handleChangeStatut(
                                                            candidature.id,
                                                            "EN_EXAMEN"
                                                        )
                                                    }
                                                >
                                                    Examiner
                                                </button>

                                                <button
                                                    className="success"
                                                    onClick={() =>
                                                        handleChangeStatut(
                                                            candidature.id,
                                                            "RETENUE"
                                                        )
                                                    }
                                                >
                                                    Retenir
                                                </button>

                                                <button
                                                    className="danger"
                                                    onClick={() =>
                                                        handleChangeStatut(
                                                            candidature.id,
                                                            "REFUSEE"
                                                        )
                                                    }
                                                >
                                                    Refuser
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {candidatures.length === 0 && (
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