import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllDepartements,
    createDepartement,
    updateDepartement,
    deleteDepartement,
} from "../services/departementService";
import {
    getAllPostes,
    createPoste,
    updatePoste,
    deletePoste,
} from "../services/posteService";
import "../styles/dashboard.css";

function ReferentielsAdmin() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [departements, setDepartements] = useState([]);
    const [postes, setPostes] = useState([]);

    const [activeTab, setActiveTab] = useState("DEPARTEMENTS");

    const [newDepartement, setNewDepartement] = useState({
        nom: "",
        description: "",
    });

    const [editDepartement, setEditDepartement] = useState(null);

    const [newPoste, setNewPoste] = useState({
        libelle: "",
        description: "",
        departementId: "",
    });

    const [editPoste, setEditPoste] = useState(null);

    const fetchData = async () => {
        try {
            const departementsData = await getAllDepartements();
            const postesData = await getAllPostes();

            setDepartements(
                [...departementsData].sort((a, b) => b.id - a.id)
            );

            setPostes(
                [...postesData].sort((a, b) => b.id - a.id)
            );
        } catch (error) {
            console.error("Erreur chargement référentiels", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    const handleCreateDepartement = async (e) => {
        e.preventDefault();

        try {
            await createDepartement(newDepartement);

            setNewDepartement({
                nom: "",
                description: "",
            });

            fetchData();
        } catch (error) {
            alert("Erreur lors de la création du département.");
        }
    };

    const handleUpdateDepartement = async (e) => {
        e.preventDefault();

        try {
            await updateDepartement(editDepartement.id, editDepartement);
            setEditDepartement(null);
            fetchData();
        } catch (error) {
            alert("Erreur lors de la modification du département.");
        }
    };

    const handleDeleteDepartement = async (departement) => {
        const confirmAction = window.confirm(
            `Supprimer le département "${departement.nom}" ?`
        );

        if (!confirmAction) return;

        try {
            await deleteDepartement(departement.id);
            fetchData();
        } catch (error) {
            alert("Impossible de supprimer ce département car il est utilisé.");
        }
    };

    const handleCreatePoste = async (e) => {
        e.preventDefault();

        try {
            await createPoste({
                ...newPoste,
                departementId: Number(newPoste.departementId),
            });

            setNewPoste({
                libelle: "",
                description: "",
                departementId: "",
            });

            fetchData();
        } catch (error) {
            alert("Erreur lors de la création du poste.");
        }
    };

    const handleUpdatePoste = async (e) => {
        e.preventDefault();

        try {
            await updatePoste(editPoste.id, {
                ...editPoste,
                departementId: Number(editPoste.departementId),
            });

            setEditPoste(null);
            fetchData();
        } catch (error) {
            alert("Erreur lors de la modification du poste.");
        }
    };

    const handleDeletePoste = async (poste) => {
        const confirmAction = window.confirm(
            `Supprimer le poste "${poste.libelle}" ?`
        );

        if (!confirmAction) return;

        try {
            await deletePoste(poste.id);
            fetchData();
        } catch (error) {
            alert("Impossible de supprimer ce poste car il est utilisé.");
        }
    };

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
                        Organisation RH
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/admin/historique")}
                    >
                        Historique système
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Référentiel RH</h1>
                        <p>
                            Gestion des départements et des postes de l'entreprise.
                        </p>
                    </div>

                    <div className="dashboard-user-actions">
                        <div className="dashboard-user">{email}</div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Départements</h3>
                        <div className="stat-number">
                            {departements.length}
                        </div>
                    </div>

                    <div className="stat-card highlight-card">
                        <h3>Postes</h3>
                        <div className="stat-number">
                            {postes.length}
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Structure organisationnelle</h2>
                            <p className="section-subtitle">
                                L'admin gère les données de référence utilisées par le service RH.
                            </p>
                        </div>
                    </div>

                    <div className="filters-row">
                        <button
                            type="button"
                            className={
                                activeTab === "DEPARTEMENTS"
                                    ? "action-button"
                                    : "action-button secondary"
                            }
                            onClick={() => setActiveTab("DEPARTEMENTS")}
                        >
                            Départements
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "POSTES"
                                    ? "action-button"
                                    : "action-button secondary"
                            }
                            onClick={() => setActiveTab("POSTES")}
                        >
                            Postes
                        </button>
                    </div>

                    {activeTab === "DEPARTEMENTS" && (
                        <>
                            <form
                                className="form-grid"
                                onSubmit={handleCreateDepartement}
                            >
                                <div className="form-field">
                                    <label>Nom du département</label>
                                    <input
                                        value={newDepartement.nom}
                                        onChange={(e) =>
                                            setNewDepartement({
                                                ...newDepartement,
                                                nom: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Description</label>
                                    <input
                                        value={newDepartement.description}
                                        onChange={(e) =>
                                            setNewDepartement({
                                                ...newDepartement,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>&nbsp;</label>
                                    <button
                                        className="action-button"
                                        type="submit"
                                    >
                                        Ajouter département
                                    </button>
                                </div>
                            </form>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Département</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {departements.map((departement) => (
                                            <tr key={departement.id}>
                                                <td>{departement.id}</td>
                                                <td>{departement.nom}</td>
                                                <td>{departement.description}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="icon-button edit"
                                                            onClick={() =>
                                                                setEditDepartement(departement)
                                                            }
                                                        >
                                                            Modifier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="icon-button delete"
                                                            onClick={() =>
                                                                handleDeleteDepartement(departement)
                                                            }
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {departements.length === 0 && (
                                    <div className="empty-state">
                                        Aucun département trouvé.
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === "POSTES" && (
                        <>
                            <form
                                className="form-grid"
                                onSubmit={handleCreatePoste}
                            >
                                <div className="form-field">
                                    <label>Libellé du poste</label>
                                    <input
                                        value={newPoste.libelle}
                                        onChange={(e) =>
                                            setNewPoste({
                                                ...newPoste,
                                                libelle: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Département</label>
                                    <select
                                        value={newPoste.departementId}
                                        onChange={(e) =>
                                            setNewPoste({
                                                ...newPoste,
                                                departementId: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            Sélectionner un département
                                        </option>

                                        {departements.map((departement) => (
                                            <option
                                                key={departement.id}
                                                value={departement.id}
                                            >
                                                {departement.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field full-width">
                                    <label>Description</label>
                                    <input
                                        value={newPoste.description}
                                        onChange={(e) =>
                                            setNewPoste({
                                                ...newPoste,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <button
                                        className="action-button"
                                        type="submit"
                                    >
                                        Ajouter poste
                                    </button>
                                </div>
                            </form>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Poste</th>
                                            <th>Département</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {postes.map((poste) => (
                                            <tr key={poste.id}>
                                                <td>{poste.id}</td>
                                                <td>{poste.libelle}</td>
                                                <td>{poste.departementNom || "-"}</td>
                                                <td>{poste.description}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="icon-button edit"
                                                            onClick={() =>
                                                                setEditPoste(poste)
                                                            }
                                                        >
                                                            Modifier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="icon-button delete"
                                                            onClick={() =>
                                                                handleDeletePoste(poste)
                                                            }
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {postes.length === 0 && (
                                    <div className="empty-state">
                                        Aucun poste trouvé.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {editDepartement && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier département</h2>
                                <p>Modification d'un département.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setEditDepartement(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateDepartement}
                            className="form-grid"
                        >
                            <div className="form-field full-width">
                                <label>Nom</label>
                                <input
                                    value={editDepartement.nom}
                                    onChange={(e) =>
                                        setEditDepartement({
                                            ...editDepartement,
                                            nom: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Description</label>
                                <input
                                    value={editDepartement.description}
                                    onChange={(e) =>
                                        setEditDepartement({
                                            ...editDepartement,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button
                                    className="action-button"
                                    type="submit"
                                >
                                    Enregistrer
                                </button>

                                <button
                                    className="action-button secondary"
                                    type="button"
                                    onClick={() => setEditDepartement(null)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editPoste && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier poste</h2>
                                <p>Modification d'un poste.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setEditPoste(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdatePoste}
                            className="form-grid"
                        >
                            <div className="form-field full-width">
                                <label>Libellé</label>
                                <input
                                    value={editPoste.libelle}
                                    onChange={(e) =>
                                        setEditPoste({
                                            ...editPoste,
                                            libelle: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Département</label>
                                <select
                                    value={editPoste.departementId || ""}
                                    onChange={(e) =>
                                        setEditPoste({
                                            ...editPoste,
                                            departementId: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        Sélectionner un département
                                    </option>

                                    {departements.map((departement) => (
                                        <option
                                            key={departement.id}
                                            value={departement.id}
                                        >
                                            {departement.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label>Description</label>
                                <input
                                    value={editPoste.description}
                                    onChange={(e) =>
                                        setEditPoste({
                                            ...editPoste,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button
                                    className="action-button"
                                    type="submit"
                                >
                                    Enregistrer
                                </button>

                                <button
                                    className="action-button secondary"
                                    type="button"
                                    onClick={() => setEditPoste(null)}
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

export default ReferentielsAdmin;