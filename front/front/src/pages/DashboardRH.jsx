import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRhDashboardStats } from "../services/dashboardService";
import "../styles/dashboard.css";

function DashboardRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

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

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div className="sidebar-item active">Tableau de bord</div>
                    <div className="sidebar-item">Employés</div>
                    <div className="sidebar-item">Congés</div>
                    <div className="sidebar-item">Salaires</div>
                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/candidatures")}
                    >
                        Recrutement
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Dashboard RH</h1>
                        <p>Vue d’ensemble des priorités RH à traiter.</p>
                    </div>

                    <div className="dashboard-user">{email}</div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Employés actifs</h3>
                        <div className="stat-number">{stats.employesActifs}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Congés en attente</h3>
                        <div className="stat-number">{stats.demandesConges}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Offres ouvertes</h3>
                        <div className="stat-number">{stats.offresOuvertes}</div>
                    </div>

                    <div className="stat-card highlight-card">
                        <h3>Nouvelles candidatures</h3>
                        <div className="stat-number">{stats.nouvellesCandidatures}</div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="section-card">
                        <h2>Priorités RH</h2>

                        <div className="activity-item">
                            <strong>{stats.nouvellesCandidatures}</strong> nouvelle(s) candidature(s) à examiner.
                        </div>

                        <div className="activity-item">
                            <strong>{stats.demandesConges}</strong> demande(s) de congé en attente de validation.
                        </div>

                        <div className="activity-item">
                            <strong>{stats.offresOuvertes}</strong> offre(s) d’emploi actuellement ouverte(s).
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Actions rapides</h2>

                        <button
                            className="action-button"
                            onClick={() => navigate("/rh/candidatures")}
                        >
                            Voir les candidatures
                        </button>

                        <button className="action-button secondary">
                            Traiter les congés
                        </button>

                        <button className="action-button secondary">
                            Gérer les employés
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardRH;