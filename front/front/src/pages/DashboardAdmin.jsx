import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { getAdminDashboardStats } from "../services/adminDashboardService";
import ProfilModal from "../components/ProfilModal";
import "../styles/dashboard.css";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

function DashboardAdmin() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [showProfilModal, setShowProfilModal] = useState(false);

    const [stats, setStats] = useState({
        totalUtilisateurs: 0,
        totalEmployes: 0,
        totalRh: 0,
        totalAdmins: 0,
        employesActifs: 0,
        employesInactifs: 0,
        employesSansCompte: 0,
        repartitionRoles: {},
        repartitionStatutEmployes: {},
        repartitionDepartements: {},
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Erreur chargement dashboard admin", error);
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

    const rolesChartData = {
        labels: Object.keys(stats.repartitionRoles || {}),
        datasets: [
            {
                data: Object.values(stats.repartitionRoles || {}),
                backgroundColor: ["#1d4ed8", "#16a34a", "#f59e0b"],
                borderWidth: 0,
            },
        ],
    };

    const statutChartData = {
        labels: Object.keys(stats.repartitionStatutEmployes || {}),
        datasets: [
            {
                data: Object.values(stats.repartitionStatutEmployes || {}),
                backgroundColor: ["#16a34a", "#dc2626"],
                borderWidth: 0,
            },
        ],
    };

    const departementChartData = {
        labels: Object.keys(stats.repartitionDepartements || {}),
        datasets: [
            {
                label: "Employés",
                data: Object.values(stats.repartitionDepartements || {}),
                backgroundColor: "#1d4ed8",
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
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
                        onClick={() => navigate("/admin/utilisateurs")}
                    >
                        Utilisateurs
                    </div>

                    <div className="sidebar-item">
                        Historique système
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Dashboard Admin</h1>
                        <p>Pilotage global du système SGRH, des utilisateurs et des accès.</p>
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
                        onClick={() => navigate("/admin/utilisateurs")}
                    >
                        <h3>Total comptes</h3>
                        <div className="stat-number">{stats.totalUtilisateurs}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Employés sans compte</h3>
                        <div className="stat-number">{stats.employesSansCompte}</div>
                    </div>

                    <div
                        className="stat-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/admin/utilisateurs?role=RH")}
                    >
                        <h3>Utilisateurs RH</h3>
                        <div className="stat-number">{stats.totalRh}</div>
                    </div>

                    <div
                        className="stat-card highlight-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/admin/utilisateurs?role=ADMIN")}
                    >
                        <h3>Utilisateurs Admin</h3>
                        <div className="stat-number">{stats.totalAdmins}</div>
                    </div>
                </div>

                <div className="admin-dashboard-grid">
                    <div className="section-card chart-card">
                        <h2>Répartition des comptes par rôle</h2>
                        <p className="section-subtitle">
                            Répartition des comptes de connexion selon leur rôle.
                        </p>

                        <div className="chart-wrapper">
                            <Doughnut data={rolesChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="section-card chart-card">
                        <h2>Statut des employés</h2>
                        <p className="section-subtitle">
                            Suivi des employés actifs et inactifs.
                        </p>

                        <div className="chart-wrapper">
                            <Doughnut data={statutChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="section-card" style={{ marginTop: "24px" }}>
                    <h2>Répartition par département</h2>
                    <p className="section-subtitle">
                        Nombre d'employés affectés à chaque département.
                    </p>

                    <div className="bar-chart-wrapper">
                        <Bar data={departementChartData} options={barOptions} />
                    </div>
                </div>

                <div className="dashboard-grid" style={{ marginTop: "24px" }}>
                    <div className="section-card">
                        <h2>Activité système</h2>

                        <div className="activity-item">
                            <strong>Utilisateurs :</strong> {stats.totalUtilisateurs} compte(s) enregistrés.
                        </div>

                        <div className="activity-item">
                            <strong>Employés :</strong> {stats.employesActifs} actif(s), {stats.employesInactifs} inactif(s).
                        </div>

                        <div className="activity-item">
                            <strong>Employés sans compte :</strong> {stats.employesSansCompte}.
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Actions rapides</h2>

                        <button
                            className="action-button"
                            onClick={() => navigate("/admin/utilisateurs")}
                        >
                            Gérer les utilisateurs
                        </button>

                        <button
                            className="action-button secondary"
                            onClick={() => navigate("/admin/utilisateurs?role=RH")}
                        >
                            Voir les comptes RH
                        </button>

                        <button
                            className="action-button secondary"
                            onClick={() => navigate("/admin/utilisateurs?role=EMPLOYE")}
                        >
                            Voir les comptes employés
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

export default DashboardAdmin;