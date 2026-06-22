import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRhDashboardStats } from "../services/dashboardService";
import ProfilModal from "../components/ProfilModal";
import "../styles/dashboard.css";

function DashboardRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [showProfilModal, setShowProfilModal] = useState(false);

    const [stats, setStats] = useState({
        employesActifs: 0,
        demandesConges: 0,
        offresOuvertes: 0,
        candidaturesRecues: 0,
        nouvellesCandidatures: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getRhDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Erreur chargement statistiques RH", error);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/");
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div className="sidebar-item active">
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

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/candidatures")}
                    >
                        Candidatures
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Dashboard RH</h1>
                        <p>Vue d’ensemble des activités RH à piloter.</p>
                    </div>

                    <div className="dashboard-user-actions">
                        <div
                            className="dashboard-user clickable-user"
                            onClick={() => setShowProfilModal(true)}
                        >
                            {email}
                        </div>

                        <button className="logout-button" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div
                        className="stat-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/rh/employes")}
                    >
                        <h3>Employés actifs</h3>
                        <div className="stat-number">{stats.employesActifs}</div>
                    </div>

                    <div
                        className="stat-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/rh/conges")}
                    >
                        <h3>Congés en attente</h3>
                        <div className="stat-number">{stats.demandesConges}</div>
                    </div>

                    <div
                        className="stat-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/rh/offres")}
                    >
                        <h3>Offres ouvertes</h3>
                        <div className="stat-number">{stats.offresOuvertes}</div>
                    </div>

                    <div
                        className="stat-card highlight-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/rh/candidatures")}
                    >
                        <h3>Nouvelles candidatures</h3>
                        <div className="stat-number">{stats.nouvellesCandidatures}</div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="section-card">
                        <h2>Aperçu RH</h2>

                        <div className="overview-grid">
                            <div className="overview-item">
                                <span className="overview-label">Départements</span>
                                <span className="overview-value">6</span>
                            </div>

                            <div className="overview-item">
                                <span className="overview-label">Postes</span>
                                <span className="overview-value">7</span>
                            </div>

                            <div className="overview-item">
                                <span className="overview-label">Employés actifs</span>
                                <span className="overview-value">{stats.employesActifs}</span>
                            </div>

                            <div className="overview-item">
                                <span className="overview-label">Offres ouvertes</span>
                                <span className="overview-value">{stats.offresOuvertes}</span>
                            </div>

                            <div className="overview-item">
                                <span className="overview-label">Candidatures reçues</span>
                                <span className="overview-value">{stats.candidaturesRecues}</span>
                            </div>

                            <div className="overview-item">
                                <span className="overview-label">Congés en attente</span>
                                <span className="overview-value">{stats.demandesConges}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Actions rapides</h2>

                        <button
                            className="action-button"
                            onClick={() => navigate("/rh/employes")}
                        >
                            Gérer les employés
                        </button>

                        <button
                            className="action-button secondary"
                            onClick={() => navigate("/rh/conges")}
                        >
                            Traiter les congés
                        </button>

                        <button
                            className="action-button secondary"
                            onClick={() => navigate("/rh/salaires")}
                        >
                            Gérer les salaires
                        </button>

                        <button
                            className="action-button secondary"
                            onClick={() => navigate("/rh/candidatures")}
                        >
                            Voir les candidatures
                        </button>
                    </div>
                </div>
            </main>

            {showProfilModal && (
                <ProfilModal onClose={() => setShowProfilModal(false)} />
            )}
        </div>
    );
}

export default DashboardRH;