import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getAllUtilisateurs,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
} from "../services/utilisateurService";
import { getAllEmployes } from "../services/employeService";
import ProfilModal from "../components/ProfilModal";
import "../styles/dashboard.css";

function UtilisateursAdmin() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = localStorage.getItem("email");

    const [utilisateurs, setUtilisateurs] = useState([]);
    const [employes, setEmployes] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "TOUS");
    const [statutFilter, setStatutFilter] = useState("TOUS");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfilModal, setShowProfilModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [detailUser, setDetailUser] = useState(null);

    const [newUser, setNewUser] = useState({
        email: "",
        motDePasse: "",
        role: "EMPLOYE",
        employeId: "",
    });

    const [editUser, setEditUser] = useState({
        email: "",
        nouveauMotDePasse: "",
        role: "",
        statut: true,
    });

    const fetchData = async () => {
        try {
            const usersData = await getAllUtilisateurs();
            setUtilisateurs([...usersData].sort((a, b) => b.id - a.id));

            const employesData = await getAllEmployes();
            setEmployes(employesData);
        } catch (error) {
            console.error("Erreur chargement utilisateurs admin", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/");
    };

    const employesSansCompte = employes.filter(
        (employe) =>
            !utilisateurs.some(
                (user) => Number(user.employeId) === Number(employe.id)
            )
    );

    const filteredUtilisateurs = utilisateurs.filter((user) => {
        const searchValue = search.toLowerCase();

        const matchSearch =
            user.email?.toLowerCase().includes(searchValue) ||
            user.employeNomComplet?.toLowerCase().includes(searchValue);

        const matchRole = roleFilter === "TOUS" || user.role === roleFilter;

        const matchStatut =
            statutFilter === "TOUS" ||
            (statutFilter === "ACTIF" && user.statut === true) ||
            (statutFilter === "INACTIF" && user.statut === false);

        return matchSearch && matchRole && matchStatut;
    });

    const getEmployeDetails = (user) => {
        if (!user.employeId) return null;

        return employes.find(
            (employe) => Number(employe.id) === Number(user.employeId)
        );
    };

    const resetCreateForm = () => {
        setNewUser({
            email: "",
            motDePasse: "",
            role: "EMPLOYE",
            employeId: "",
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!newUser.email || !newUser.motDePasse || !newUser.role) {
            alert("Veuillez remplir les champs obligatoires.");
            return;
        }

        if (newUser.role !== "ADMIN" && !newUser.employeId) {
            alert("Un compte RH ou Employé doit être lié à une fiche employé.");
            return;
        }

        try {
            await createUtilisateur({
                email: newUser.email,
                motDePasse: newUser.motDePasse,
                role: newUser.role,
                employeId:
                    newUser.role === "ADMIN" ? null : Number(newUser.employeId),
            });

            setShowCreateModal(false);
            resetCreateForm();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Erreur création utilisateur.");
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);

        setEditUser({
            email: user.email,
            nouveauMotDePasse: "",
            role: user.role,
            statut: user.statut,
        });

        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!selectedUser) return;

        try {
            await updateUtilisateur(selectedUser.id, {
                email: editUser.email,
                nouveauMotDePasse: editUser.nouveauMotDePasse,
                role: editUser.role,
                statut: editUser.statut,
            });

            setShowEditModal(false);
            setSelectedUser(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Erreur modification utilisateur.");
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmAction = window.confirm(
            `Voulez-vous vraiment supprimer le compte ${user.email} ?`
        );

        if (!confirmAction) return;

        try {
            await deleteUtilisateur(user.id);
            fetchData();
        } catch (error) {
            alert("Erreur suppression utilisateur.");
        }
    };

    const getStatutLabel = (statut) => {
        return statut ? "Actif" : "Inactif";
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

                    <div className="sidebar-item active">
                        Utilisateurs
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
                        <h1>Gestion des utilisateurs</h1>
                        <p>Création, modification, rôles et sécurité des comptes.</p>
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
                        <h3>Total comptes</h3>
                        <div className="stat-number">{utilisateurs.length}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Employés sans compte</h3>
                        <div className="stat-number">{employesSansCompte.length}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Comptes RH</h3>
                        <div className="stat-number">
                            {utilisateurs.filter((u) => u.role === "RH").length}
                        </div>
                    </div>

                    <div className="stat-card highlight-card">
                        <h3>Comptes employés</h3>
                        <div className="stat-number">
                            {utilisateurs.filter((u) => u.role === "EMPLOYE").length}
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Liste des utilisateurs</h2>
                            <p className="section-subtitle">
                                Cliquez sur une ligne pour voir le détail du compte.
                            </p>
                        </div>

                        <button
                            className="action-button"
                            onClick={() => setShowCreateModal(true)}
                            style={{ width: "220px", marginBottom: 0 }}
                        >
                            Créer utilisateur
                        </button>
                    </div>

                    <div className="filters-row">
                        <input
                            className="search-input"
                            placeholder="Rechercher nom ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les rôles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="RH">RH</option>
                            <option value="EMPLOYE">Employé</option>
                        </select>

                        <select
                            className="filter-select"
                            value={statutFilter}
                            onChange={(e) => setStatutFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les statuts</option>
                            <option value="ACTIF">Actifs</option>
                            <option value="INACTIF">Inactifs</option>
                        </select>
                    </div>

                    <div className="table-container">
                        <table className="data-table clickable-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Employé lié</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUtilisateurs.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => setDetailUser(user)}
                                    >
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.employeNomComplet || "-"}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${
                                                    user.statut ? "ACTIF" : "INACTIF"
                                                }`}
                                            >
                                                {getStatutLabel(user.statut)}
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                className="table-actions"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    className="file-button"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    Modifier
                                                </button>

                                                <button
                                                    className="danger-button"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUtilisateurs.length === 0 && (
                            <div className="empty-state">
                                Aucun utilisateur trouvé.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Créer un utilisateur</h2>
                                <p>Ajout d’un nouveau compte de connexion.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetCreateForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="form-grid">
                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Mot de passe initial</label>
                                <input
                                    type="password"
                                    value={newUser.motDePasse}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            motDePasse: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Rôle</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => {
                                        const selectedRole = e.target.value;

                                        setNewUser({
                                            ...newUser,
                                            role: selectedRole,
                                            employeId:
                                                selectedRole === "ADMIN"
                                                    ? ""
                                                    : newUser.employeId,
                                        });
                                    }}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="RH">RH</option>
                                    <option value="EMPLOYE">EMPLOYE</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Employé sans compte à lier</label>
                                <select
                                    value={newUser.employeId}
                                    disabled={newUser.role === "ADMIN"}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            employeId: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">
                                        {newUser.role === "ADMIN"
                                            ? "Non applicable pour un administrateur"
                                            : "Sélectionner un employé sans compte"}
                                    </option>

                                    {employesSansCompte.map((employe) => (
                                        <option key={employe.id} value={employe.id}>
                                            {employe.prenom} {employe.nom} — {employe.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Créer le compte
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetCreateForm();
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier utilisateur</h2>
                                <p>{selectedUser.email}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="form-grid">
                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, email: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={editUser.nouveauMotDePasse}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            nouveauMotDePasse: e.target.value,
                                        })
                                    }
                                    placeholder="Laisser vide si inchangé"
                                />
                            </div>

                            <div className="form-field">
                                <label>Rôle</label>
                                <select
                                    value={editUser.role}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, role: e.target.value })
                                    }
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="RH">RH</option>
                                    <option value="EMPLOYE">EMPLOYE</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Statut du compte</label>
                                <select
                                    value={editUser.statut ? "ACTIF" : "INACTIF"}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            statut: e.target.value === "ACTIF",
                                        })
                                    }
                                >
                                    <option value="ACTIF">Actif</option>
                                    <option value="INACTIF">Inactif</option>
                                </select>
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Enregistrer
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {detailUser && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Détail utilisateur</h2>
                                <p>{detailUser.email}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setDetailUser(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <p><strong>Email :</strong> {detailUser.email}</p>
                            <p><strong>Rôle :</strong> {detailUser.role}</p>
                            <p><strong>Statut compte :</strong> {detailUser.statut ? "Actif" : "Inactif"}</p>
                            <p><strong>Employé lié :</strong> {detailUser.employeNomComplet || "Aucun"}</p>

                            {detailUser.role === "ADMIN" && !detailUser.employeId && (
                                <p className="full-width">
                                    <strong>Type :</strong> Compte administrateur technique.
                                </p>
                            )}

                            {getEmployeDetails(detailUser) && (
                                <>
                                    <p><strong>Département :</strong> {getEmployeDetails(detailUser).departementNom || "-"}</p>
                                    <p><strong>Poste :</strong> {getEmployeDetails(detailUser).posteLibelle || "-"}</p>
                                    <p><strong>Téléphone :</strong> {getEmployeDetails(detailUser).telephone || "-"}</p>
                                    <p><strong>Contrat :</strong> {getEmployeDetails(detailUser).typeContrat || "-"}</p>
                                    <p><strong>Statut employé :</strong> {getEmployeDetails(detailUser).statut || "-"}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showProfilModal && (
                <ProfilModal onClose={() => setShowProfilModal(false)} />
            )}
        </div>
    );
}

export default UtilisateursAdmin;