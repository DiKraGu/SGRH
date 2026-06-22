import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllEmployes,
    createEmploye,
    updateEmploye,
    desactiverEmploye,
} from "../services/employeService";
import { getAllDepartements } from "../services/departementService";
import { getAllPostes } from "../services/posteService";
import "../styles/dashboard.css";

function EmployesRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [employes, setEmployes] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [postes, setPostes] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [departementFilter, setDepartementFilter] = useState("TOUS");
    const [contratFilter, setContratFilter] = useState("TOUS");
    const [statutFilter, setStatutFilter] = useState("TOUS");

    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [editEmploye, setEditEmploye] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newEmploye, setNewEmploye] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        salaireBase: "",
        dateEmbauche: "",
        dateFinContrat: "",
        quotaAnnuelConges: 22,
        statut: "ACTIF",
        typeContrat: "CDI",
        departementId: "",
        posteId: "",
    });

    const postesParDepartement = {
        1: [1, 7, 8, 9],
        2: [2, 10, 11, 12],
        3: [3, 13, 14, 15],
        4: [4, 16, 17, 18],
        5: [5, 19, 20, 21],
        6: [6, 22, 23, 24],
    };

    const isEmployeConnecte = (employe) => {
        return employe?.email === email;
    };

    const getPostesFiltres = (departementId) => {
        if (!departementId) return [];

        const idsPostesAutorises =
            postesParDepartement[Number(departementId)] || [];

        return postes.filter((poste) =>
            idsPostesAutorises.includes(Number(poste.id))
        );
    };

    const fetchEmployes = async () => {
        try {
            const data = await getAllEmployes();
            setEmployes([...data].sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Erreur chargement employés", error);
        }
    };

    const fetchReferentiels = async () => {
        try {
            const departementsData = await getAllDepartements();
            const postesData = await getAllPostes();

            setDepartements(departementsData);
            setPostes(postesData);
        } catch (error) {
            console.error("Erreur chargement départements/postes", error);
        }
    };

    useEffect(() => {
        fetchEmployes();
        fetchReferentiels();
    }, []);

    const filteredEmployes = employes.filter((employe) => {
        const search = searchTerm.toLowerCase();

        const fullText = `
            ${employe.nom || ""}
            ${employe.prenom || ""}
            ${employe.email || ""}
            ${employe.telephone || ""}
            ${employe.departementNom || ""}
            ${employe.posteLibelle || ""}
            ${employe.typeContrat || ""}
            ${employe.statut || ""}
        `.toLowerCase();

        const matchSearch = fullText.includes(search);

        const matchDepartement =
            departementFilter === "TOUS" ||
            String(employe.departementId) === String(departementFilter);

        const matchContrat =
            contratFilter === "TOUS" || employe.typeContrat === contratFilter;

        const matchStatut =
            statutFilter === "TOUS" || employe.statut === statutFilter;

        return matchSearch && matchDepartement && matchContrat && matchStatut;
    });

    const handleEditChange = (field, value) => {
        if (field === "departementId") {
            setEditEmploye({
                ...editEmploye,
                departementId: value,
                posteId: "",
            });
            return;
        }

        if (field === "typeContrat") {
            setEditEmploye({
                ...editEmploye,
                typeContrat: value,
                dateFinContrat:
                    value === "CDD" ? editEmploye.dateFinContrat || "" : "",
            });
            return;
        }

        setEditEmploye({
            ...editEmploye,
            [field]: value,
        });
    };

    const handleNewEmployeChange = (field, value) => {
        if (field === "departementId") {
            setNewEmploye({
                ...newEmploye,
                departementId: value,
                posteId: "",
            });
            return;
        }

        if (field === "typeContrat") {
            setNewEmploye({
                ...newEmploye,
                typeContrat: value,
                dateFinContrat:
                    value === "CDD" ? newEmploye.dateFinContrat || "" : "",
            });
            return;
        }

        setNewEmploye({
            ...newEmploye,
            [field]: value,
        });
    };

    const resetNewEmployeForm = () => {
        setNewEmploye({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            salaireBase: "",
            dateEmbauche: "",
            dateFinContrat: "",
            quotaAnnuelConges: 22,
            statut: "ACTIF",
            typeContrat: "CDI",
            departementId: "",
            posteId: "",
        });
    };

    const validateCDD = (employe) => {
        if (employe.typeContrat === "CDD" && !employe.dateFinContrat) {
            alert("La date de fin du contrat est obligatoire pour un CDD.");
            return false;
        }

        if (
            employe.typeContrat === "CDD" &&
            employe.dateEmbauche &&
            employe.dateFinContrat &&
            employe.dateFinContrat < employe.dateEmbauche
        ) {
            alert("La date de fin du contrat doit être après la date d'embauche.");
            return false;
        }

        return true;
    };

    const handleCreateEmploye = async (e) => {
        e.preventDefault();

        if (!validateCDD(newEmploye)) return;

        try {
            const employeToCreate = {
                ...newEmploye,
                dateFinContrat:
                    newEmploye.typeContrat === "CDD"
                        ? newEmploye.dateFinContrat
                        : null,
                salaireBase: Number(newEmploye.salaireBase),
                quotaAnnuelConges: Number(newEmploye.quotaAnnuelConges),
                departementId: Number(newEmploye.departementId),
                posteId: Number(newEmploye.posteId),
            };

            await createEmploye(employeToCreate);

            setShowAddModal(false);
            resetNewEmployeForm();
            fetchEmployes();
        } catch (error) {
            console.error("Erreur création employé", error);
            alert(
                error.response?.data?.message ||
                    "Erreur lors de la création de l'employé."
            );
        }
    };

    const handleUpdateEmploye = async (e) => {
        e.preventDefault();

        if (!validateCDD(editEmploye)) return;

        try {
            const employeToUpdate = {
                ...editEmploye,
                dateFinContrat:
                    editEmploye.typeContrat === "CDD"
                        ? editEmploye.dateFinContrat
                        : null,
                salaireBase: Number(editEmploye.salaireBase),
                quotaAnnuelConges: Number(editEmploye.quotaAnnuelConges),
                departementId: Number(editEmploye.departementId),
                posteId: Number(editEmploye.posteId),
            };

            await updateEmploye(editEmploye.id, employeToUpdate);

            setEditEmploye(null);
            setSelectedEmploye(null);
            fetchEmployes();
        } catch (error) {
            console.error("Erreur modification employé", error);
            alert(
                error.response?.data?.message ||
                    "Erreur lors de la modification de l'employé."
            );
        }
    };

    const handleDesactiver = async (employe) => {
        const confirmAction = window.confirm(
            `Voulez-vous vraiment désactiver ${employe.prenom} ${employe.nom} ?`
        );

        if (!confirmAction) return;

        try {
            await desactiverEmploye(employe.id);
            setSelectedEmploye(null);
            fetchEmployes();
        } catch (error) {
            console.error("Erreur désactivation employé", error);
            alert("Erreur lors de la désactivation.");
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div className="sidebar-item" onClick={() => navigate("/rh")}>
                        Tableau de bord
                    </div>

                    <div className="sidebar-item active">Employés</div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/conges")}>
                        Congés
                    </div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/salaires")}>
                        Salaires
                    </div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/offres")}>
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
                        <h1>Employés</h1>
                        <p>Gestion des employés enregistrés dans le système.</p>
                    </div>

                    <div className="dashboard-user">{email}</div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Liste des employés</h2>
                            <p className="section-subtitle">
                                Recherchez et filtrez les employés par département, contrat ou statut.
                            </p>
                        </div>

                        <button
                            className="action-button"
                            type="button"
                            onClick={() => setShowAddModal(true)}
                        >
                            Ajouter un employé
                        </button>
                    </div>

                    <div className="filters-row employee-filters">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Rechercher un employé..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="filter-select"
                            value={departementFilter}
                            onChange={(e) => setDepartementFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les départements</option>

                            {departements.map((departement) => (
                                <option key={departement.id} value={departement.id}>
                                    {departement.nom}
                                </option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={contratFilter}
                            onChange={(e) => setContratFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les contrats</option>
                            <option value="CDI">CDI</option>
                            <option value="CDD">CDD</option>
                            <option value="STAGE">STAGE</option>
                        </select>

                        <select
                            className="filter-select"
                            value={statutFilter}
                            onChange={(e) => setStatutFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les statuts</option>
                            <option value="ACTIF">Actif</option>
                            <option value="INACTIF">Inactif</option>
                        </select>
                    </div>

                    <div className="table-container">
                        <table className="data-table clickable-table">
                            <thead>
                                <tr>
                                    <th>Nom complet</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Département</th>
                                    <th>Poste</th>
                                    <th>Contrat</th>
                                    <th>Fin contrat</th>
                                    <th>Statut</th>
                                    <th>Salaire</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEmployes.map((employe) => (
                                    <tr
                                        key={employe.id}
                                        onClick={() => setSelectedEmploye(employe)}
                                    >
                                        <td>{employe.prenom} {employe.nom}</td>
                                        <td>{employe.email || "-"}</td>
                                        <td>{employe.telephone}</td>
                                        <td>{employe.departementNom}</td>
                                        <td>{employe.posteLibelle}</td>
                                        <td>{employe.typeContrat}</td>
                                        <td>
                                            {employe.typeContrat === "CDD"
                                                ? employe.dateFinContrat || "-"
                                                : "-"}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${employe.statut}`}>
                                                {employe.statut}
                                            </span>
                                        </td>
                                        <td>{employe.salaireBase} DH</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredEmployes.length === 0 && (
                            <div className="empty-state">
                                Aucun employé trouvé.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedEmploye && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>{selectedEmploye.prenom} {selectedEmploye.nom}</h2>
                                <p>Fiche détaillée de l’employé</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedEmploye(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <p><strong>Email :</strong> {selectedEmploye.email || "-"}</p>
                            <p><strong>Téléphone :</strong> {selectedEmploye.telephone}</p>
                            <p><strong>Département :</strong> {selectedEmploye.departementNom}</p>
                            <p><strong>Poste :</strong> {selectedEmploye.posteLibelle}</p>
                            <p><strong>Contrat :</strong> {selectedEmploye.typeContrat}</p>

                            {selectedEmploye.typeContrat === "CDD" && (
                                <p>
                                    <strong>Date fin contrat :</strong>{" "}
                                    {selectedEmploye.dateFinContrat || "-"}
                                </p>
                            )}

                            <p><strong>Statut :</strong> {selectedEmploye.statut}</p>
                            <p><strong>Salaire :</strong> {selectedEmploye.salaireBase} DH</p>
                            <p><strong>Date embauche :</strong> {selectedEmploye.dateEmbauche}</p>
                            <p><strong>Quota congés :</strong> {selectedEmploye.quotaAnnuelConges} jours</p>
                        </div>

                        <div className="modal-actions">
                            {isEmployeConnecte(selectedEmploye) ? (
                                <div className="empty-state full-width">
                                    Vous ne pouvez pas modifier votre propre fiche RH depuis cet espace.
                                    Utilisez votre profil pour modifier votre email ou mot de passe.
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="action-button"
                                        onClick={() => {
                                            setEditEmploye(selectedEmploye);
                                            setSelectedEmploye(null);
                                        }}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="action-button danger-button"
                                        onClick={() => handleDesactiver(selectedEmploye)}
                                    >
                                        Désactiver
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {editEmploye && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier employé</h2>
                                <p>Modification des informations RH de l’employé.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setEditEmploye(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateEmploye} className="form-grid">
                            <div className="form-field">
                                <label>Nom</label>
                                <input
                                    value={editEmploye.nom || ""}
                                    onChange={(e) => handleEditChange("nom", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Prénom</label>
                                <input
                                    value={editEmploye.prenom || ""}
                                    onChange={(e) => handleEditChange("prenom", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Email professionnel</label>
                                <input
                                    type="email"
                                    value={editEmploye.email || ""}
                                    onChange={(e) => handleEditChange("email", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Téléphone</label>
                                <input
                                    value={editEmploye.telephone || ""}
                                    onChange={(e) => handleEditChange("telephone", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire de base</label>
                                <input
                                    type="number"
                                    value={editEmploye.salaireBase || ""}
                                    onChange={(e) => handleEditChange("salaireBase", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Date d’embauche</label>
                                <input
                                    type="date"
                                    value={editEmploye.dateEmbauche || ""}
                                    onChange={(e) => handleEditChange("dateEmbauche", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Quota annuel congés</label>
                                <input
                                    type="number"
                                    value={editEmploye.quotaAnnuelConges || ""}
                                    onChange={(e) => handleEditChange("quotaAnnuelConges", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Type de contrat</label>
                                <select
                                    value={editEmploye.typeContrat || ""}
                                    onChange={(e) => handleEditChange("typeContrat", e.target.value)}
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="STAGE">STAGE</option>
                                </select>
                            </div>

                            {editEmploye.typeContrat === "CDD" && (
                                <div className="form-field">
                                    <label>Date de fin du contrat</label>
                                    <input
                                        type="date"
                                        value={editEmploye.dateFinContrat || ""}
                                        onChange={(e) => handleEditChange("dateFinContrat", e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-field">
                                <label>Statut</label>
                                <select
                                    value={editEmploye.statut || ""}
                                    onChange={(e) => handleEditChange("statut", e.target.value)}
                                >
                                    <option value="ACTIF">ACTIF</option>
                                    <option value="INACTIF">INACTIF</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Département</label>
                                <select
                                    value={editEmploye.departementId || ""}
                                    onChange={(e) => handleEditChange("departementId", e.target.value)}
                                >
                                    <option value="">Sélectionner un département</option>

                                    {departements.map((departement) => (
                                        <option key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Poste</label>
                                <select
                                    value={editEmploye.posteId || ""}
                                    onChange={(e) => handleEditChange("posteId", e.target.value)}
                                    disabled={!editEmploye.departementId}
                                >
                                    <option value="">Sélectionner un poste</option>

                                    {getPostesFiltres(editEmploye.departementId).map((poste) => (
                                        <option key={poste.id} value={poste.id}>
                                            {poste.libelle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Enregistrer
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => setEditEmploye(null)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Ajouter un employé</h2>
                                <p>Création d’une nouvelle fiche employé.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewEmployeForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateEmploye} className="form-grid">
                            <div className="form-field">
                                <label>Nom</label>
                                <input
                                    value={newEmploye.nom}
                                    onChange={(e) => handleNewEmployeChange("nom", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Prénom</label>
                                <input
                                    value={newEmploye.prenom}
                                    onChange={(e) => handleNewEmployeChange("prenom", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Email professionnel</label>
                                <input
                                    type="email"
                                    value={newEmploye.email}
                                    onChange={(e) => handleNewEmployeChange("email", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Téléphone</label>
                                <input
                                    value={newEmploye.telephone}
                                    onChange={(e) => handleNewEmployeChange("telephone", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire de base</label>
                                <input
                                    type="number"
                                    value={newEmploye.salaireBase}
                                    onChange={(e) => handleNewEmployeChange("salaireBase", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Date d’embauche</label>
                                <input
                                    type="date"
                                    value={newEmploye.dateEmbauche}
                                    onChange={(e) => handleNewEmployeChange("dateEmbauche", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Quota annuel congés</label>
                                <input
                                    type="number"
                                    value={newEmploye.quotaAnnuelConges}
                                    onChange={(e) => handleNewEmployeChange("quotaAnnuelConges", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Type de contrat</label>
                                <select
                                    value={newEmploye.typeContrat}
                                    onChange={(e) => handleNewEmployeChange("typeContrat", e.target.value)}
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="STAGE">STAGE</option>
                                </select>
                            </div>

                            {newEmploye.typeContrat === "CDD" && (
                                <div className="form-field">
                                    <label>Date de fin du contrat</label>
                                    <input
                                        type="date"
                                        value={newEmploye.dateFinContrat || ""}
                                        onChange={(e) =>
                                            handleNewEmployeChange("dateFinContrat", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-field">
                                <label>Statut</label>
                                <select
                                    value={newEmploye.statut}
                                    onChange={(e) => handleNewEmployeChange("statut", e.target.value)}
                                >
                                    <option value="ACTIF">ACTIF</option>
                                    <option value="INACTIF">INACTIF</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Département</label>
                                <select
                                    value={newEmploye.departementId}
                                    onChange={(e) => handleNewEmployeChange("departementId", e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner un département</option>

                                    {departements.map((departement) => (
                                        <option key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Poste</label>
                                <select
                                    value={newEmploye.posteId}
                                    onChange={(e) => handleNewEmployeChange("posteId", e.target.value)}
                                    required
                                    disabled={!newEmploye.departementId}
                                >
                                    <option value="">Sélectionner un poste</option>

                                    {getPostesFiltres(newEmploye.departementId).map((poste) => (
                                        <option key={poste.id} value={poste.id}>
                                            {poste.libelle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Ajouter
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewEmployeForm();
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

export default EmployesRH;