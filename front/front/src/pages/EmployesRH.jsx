import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllEmployes,
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
    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [editEmploye, setEditEmploye] = useState(null);

    const fetchEmployes = async () => {
        try {
            const data = await getAllEmployes();
            setEmployes(data);
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

        return fullText.includes(search);
    });

    const handleEditChange = (field, value) => {
        setEditEmploye({
            ...editEmploye,
            [field]: value,
        });
    };

    const handleUpdateEmploye = async (e) => {
        e.preventDefault();

        try {
            const employeToUpdate = {
                ...editEmploye,
                departementId: Number(editEmploye.departementId),
                posteId: Number(editEmploye.posteId),
                salaireBase: Number(editEmploye.salaireBase),
                quotaAnnuelConges: Number(editEmploye.quotaAnnuelConges),
            };

            await updateEmploye(editEmploye.id, employeToUpdate);

            setEditEmploye(null);
            setSelectedEmploye(null);
            fetchEmployes();
        } catch (error) {
            console.error("Erreur modification employé", error);
            alert("Erreur lors de la modification de l'employé.");
        }
    };

    const handleDesactiver = async (employe) => {
        const confirm = window.confirm(
            `Voulez-vous vraiment désactiver ${employe.prenom} ${employe.nom} ?`
        );

        if (!confirm) return;

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
                                Cliquez sur un employé pour consulter sa fiche détaillée.
                            </p>
                        </div>

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Rechercher un employé..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

                                        <td>
                                            {employe.email ? (
                                                <span className="email-link">
                                                    {employe.email}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td>{employe.telephone}</td>
                                        <td>{employe.departementNom}</td>
                                        <td>{employe.posteLibelle}</td>
                                        <td>{employe.typeContrat}</td>

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
                                <h2>
                                    {selectedEmploye.prenom} {selectedEmploye.nom}
                                </h2>
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
                            <p><strong>Statut :</strong> {selectedEmploye.statut}</p>
                            <p><strong>Salaire :</strong> {selectedEmploye.salaireBase} DH</p>
                            <p><strong>Date embauche :</strong> {selectedEmploye.dateEmbauche}</p>
                            <p><strong>Quota congés :</strong> {selectedEmploye.quotaAnnuelConges} jours</p>
                        </div>

                        <div className="modal-actions">
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
                                    onChange={(e) =>
                                        handleEditChange("departementId", e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        handleEditChange("posteId", e.target.value)
                                    }
                                >
                                    <option value="">Sélectionner un poste</option>

                                    {postes.map((poste) => (
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
        </div>
    );
}

export default EmployesRH;