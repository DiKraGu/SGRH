import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistoriqueActions } from "../services/historiqueService";
import ProfilModal from "../components/ProfilModal";
import "../styles/dashboard.css";

function HistoriqueAdmin() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [historique, setHistorique] = useState([]);
    const [search, setSearch] = useState("");
    const [showProfilModal, setShowProfilModal] = useState(false);

    const fetchHistorique = async () => {
        try {
            const data = await getHistoriqueActions();
            setHistorique(data);
        } catch (error) {
            console.error("Erreur chargement historique", error);
        }
    };

    useEffect(() => {
        fetchHistorique();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/");
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    const filteredHistorique = historique.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.utilisateur?.toLowerCase().includes(value) ||
            item.action?.toLowerCase().includes(value) ||
            item.details?.toLowerCase().includes(value)
        );
    });

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/admin")}
                    >
                        Tableau de bord
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/admin/utilisateurs")}
                    >
                        Utilisateurs
                    </div>

                    <div className="sidebar-item active">
                        Historique système
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Historique système</h1>
                        <p>Suivi des actions importantes effectuées dans la plateforme.</p>
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
                    <div className="stat-card">
                        <h3>Total actions</h3>
                        <div className="stat-number">{historique.length}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Créations</h3>
                        <div className="stat-number">
                            {historique.filter((h) => h.action?.includes("Création")).length}
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Modifications</h3>
                        <div className="stat-number">
                            {historique.filter((h) => h.action?.includes("Modification")).length}
                        </div>
                    </div>

                    <div className="stat-card highlight-card">
                        <h3>Suppressions</h3>
                        <div className="stat-number">
                            {historique.filter((h) => h.action?.includes("Suppression")).length}
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Journal des actions</h2>
                            <p className="section-subtitle">
                                Consultez les événements enregistrés dans le système.
                            </p>
                        </div>
                    </div>

                    <div className="filters-row">
                        <input
                            className="search-input"
                            placeholder="Rechercher utilisateur, action ou détail..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Utilisateur</th>
                                    <th>Action</th>
                                    <th>Détail</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredHistorique.map((item) => (
                                    <tr key={item.id}>
                                        <td>{formatDate(item.dateAction)}</td>
                                        <td>{item.utilisateur}</td>
                                        <td>
                                            <span className="status-badge ACTIF">
                                                {item.action}
                                            </span>
                                        </td>
                                        <td>{item.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredHistorique.length === 0 && (
                            <div className="empty-state">
                                Aucune action trouvée.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showProfilModal && (
                <ProfilModal onClose={() => setShowProfilModal(false)} />
            )}
        </div>
    );
}

export default HistoriqueAdmin;