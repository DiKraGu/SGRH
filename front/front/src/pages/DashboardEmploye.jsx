import { useEffect, useState } from "react";
import {
    getEmployeConnecte,
} from "../services/employeService";
import {
    getCongesByEmploye,
    demanderConge,
    annulerConge,
} from "../services/congeService";
import "../styles/dashboard.css";

function DashboardEmploye() {
    const email = localStorage.getItem("email");

    const [employe, setEmploye] = useState(null);
    const [conges, setConges] = useState([]);
    const [showCongeModal, setShowCongeModal] = useState(false);

    const [newConge, setNewConge] = useState({
        dateDebut: "",
        dateFin: "",
        nombreJours: "",
        motif: "",
        typeConge: "ANNUEL",
    });

    const fetchEmployeAndConges = async () => {
        try {
            const employeData = await getEmployeConnecte();
            setEmploye(employeData);

            const congesData = await getCongesByEmploye(employeData.id);
            const sortedConges = [...congesData].sort((a, b) => b.id - a.id);
            setConges(sortedConges);
        } catch (error) {
            console.error("Erreur chargement espace employé", error);
        }
    };

    useEffect(() => {
        fetchEmployeAndConges();
    }, []);

    const calculateNombreJours = (dateDebut, dateFin) => {
        if (!dateDebut || !dateFin) {
            return "";
        }

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        const difference = fin.getTime() - debut.getTime();

        if (difference < 0) {
            return "";
        }

        return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleCongeChange = (field, value) => {
        const updatedConge = {
            ...newConge,
            [field]: value,
        };

        if (field === "dateDebut" || field === "dateFin") {
            updatedConge.nombreJours = calculateNombreJours(
                updatedConge.dateDebut,
                updatedConge.dateFin
            );
        }

        setNewConge(updatedConge);
    };

    const resetCongeForm = () => {
        setNewConge({
            dateDebut: "",
            dateFin: "",
            nombreJours: "",
            motif: "",
            typeConge: "ANNUEL",
        });
    };

    const handleDemanderConge = async (e) => {
        e.preventDefault();

        if (!employe) {
            alert("Employé introuvable.");
            return;
        }

        if (!newConge.nombreJours || Number(newConge.nombreJours) <= 0) {
            alert("Les dates de congé sont invalides.");
            return;
        }

        try {
            const congeToCreate = {
                ...newConge,
                nombreJours: Number(newConge.nombreJours),
                employeId: employe.id,
            };

            await demanderConge(congeToCreate);

            setShowCongeModal(false);
            resetCongeForm();
            fetchEmployeAndConges();
        } catch (error) {
            console.error("Erreur demande congé", error);
            alert("Erreur lors de la création de la demande.");
        }
    };

    const handleAnnulerConge = async (conge) => {
        const confirmAction = window.confirm(
            "Voulez-vous vraiment annuler cette demande de congé ?"
        );

        if (!confirmAction) return;

        try {
            await annulerConge(conge.id);
            fetchEmployeAndConges();
        } catch (error) {
            console.error("Erreur annulation congé", error);
            alert("Seule une demande en attente peut être annulée.");
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case "EN_ATTENTE":
                return "En attente";
            case "VALIDE":
                return "Validé";
            case "REFUSE":
                return "Refusé";
            default:
                return statut;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "ANNUEL":
                return "Congé annuel";
            case "MALADIE":
                return "Congé maladie";
            case "EXCEPTIONNEL":
                return "Congé exceptionnel";
            default:
                return type;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div className="sidebar-item active">
                        Mon espace
                    </div>

                    <div className="sidebar-item">
                        Mes congés
                    </div>

                    <div className="sidebar-item">
                        Mes fiches de paie
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Espace Employé</h1>
                        <p>
                            Consultation de votre profil, de votre quota et de vos demandes de congés.
                        </p>
                    </div>

                    <div className="dashboard-user">
                        {email}
                    </div>
                </div>

                {employe && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Quota congés restant</h3>
                                <div className="stat-number">
                                    {employe.quotaAnnuelConges}
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>Département</h3>
                                <div className="stat-number small-stat">
                                    {employe.departementNom}
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>Poste</h3>
                                <div className="stat-number small-stat">
                                    {employe.posteLibelle}
                                </div>
                            </div>

                            <div className="stat-card highlight-card">
                                <h3>Statut</h3>
                                <div className="stat-number small-stat">
                                    {employe.statut}
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <div className="section-card">
                                <h2>Mon profil</h2>

                                <div className="details-grid">
                                    <p><strong>Nom :</strong> {employe.nom}</p>
                                    <p><strong>Prénom :</strong> {employe.prenom}</p>
                                    <p><strong>Email :</strong> {employe.email || email}</p>
                                    <p><strong>Téléphone :</strong> {employe.telephone}</p>
                                    <p><strong>Contrat :</strong> {employe.typeContrat}</p>
                                    <p><strong>Date embauche :</strong> {employe.dateEmbauche}</p>
                                </div>
                            </div>

                            <div className="section-card">
                                <h2>Actions rapides</h2>

                                <button
                                    className="action-button"
                                    onClick={() => setShowCongeModal(true)}
                                >
                                    Demander un congé
                                </button>
                            </div>
                        </div>

                        <div className="section-card" style={{ marginTop: "24px" }}>
                            <div className="section-header">
                                <div>
                                    <h2>Mes demandes de congés</h2>
                                    <p className="section-subtitle">
                                        Suivi de vos demandes envoyées au service RH.
                                    </p>
                                </div>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Date début</th>
                                            <th>Date fin</th>
                                            <th>Jours</th>
                                            <th>Motif</th>
                                            <th>Statut</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {conges.map((conge) => (
                                            <tr key={conge.id}>
                                                <td>{getTypeLabel(conge.typeConge)}</td>
                                                <td>{conge.dateDebut}</td>
                                                <td>{conge.dateFin}</td>
                                                <td>{conge.nombreJours}</td>
                                                <td>{conge.motif}</td>
                                                <td>
                                                    <span className={`status-badge ${conge.statut}`}>
                                                        {getStatutLabel(conge.statut)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {conge.statut === "EN_ATTENTE" ? (
                                                        <button
                                                            className="file-button"
                                                            onClick={() => handleAnnulerConge(conge)}
                                                        >
                                                            Annuler
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {conges.length === 0 && (
                                    <div className="empty-state">
                                        Aucune demande de congé trouvée.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {showCongeModal && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Demander un congé</h2>
                                <p>Votre demande sera envoyée au service RH.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowCongeModal(false);
                                    resetCongeForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleDemanderConge} className="form-grid">
                            <div className="form-field">
                                <label>Type de congé</label>
                                <select
                                    value={newConge.typeConge}
                                    onChange={(e) => handleCongeChange("typeConge", e.target.value)}
                                >
                                    <option value="ANNUEL">Congé annuel</option>
                                    <option value="MALADIE">Congé maladie</option>
                                    <option value="EXCEPTIONNEL">Congé exceptionnel</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Nombre de jours</label>
                                <input
                                    type="number"
                                    value={newConge.nombreJours}
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>Date début</label>
                                <input
                                    type="date"
                                    value={newConge.dateDebut}
                                    onChange={(e) => handleCongeChange("dateDebut", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Date fin</label>
                                <input
                                    type="date"
                                    value={newConge.dateFin}
                                    onChange={(e) => handleCongeChange("dateFin", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Motif</label>
                                <input
                                    value={newConge.motif}
                                    onChange={(e) => handleCongeChange("motif", e.target.value)}
                                    placeholder="Exemple : Congé annuel"
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Envoyer la demande
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowCongeModal(false);
                                        resetCongeForm();
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

export default DashboardEmploye;