import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllConges,
    validerConge,
    refuserConge,
} from "../services/congeService";

import "../styles/dashboard.css";

function CongesRH() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [conges, setConges] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [statutFilter, setStatutFilter] = useState("TOUS");

    const [selectedConge, setSelectedConge] = useState(null);

    const fetchConges = async () => {

        try {

            const data = await getAllConges();

            setConges(data);

        } catch (error) {

            console.error("Erreur chargement congés", error);
        }
    };

    useEffect(() => {

        fetchConges();

    }, []);

    const filteredConges = conges.filter((conge) => {

        const search = searchTerm.toLowerCase();

        const fullText = `
            ${conge.employeNom || ""}
            ${conge.employePrenom || ""}
            ${conge.motif || ""}
            ${conge.typeConge || ""}
            ${conge.statut || ""}
        `.toLowerCase();

        const matchSearch = fullText.includes(search);

        const matchStatut =
            statutFilter === "TOUS" ||
            conge.statut === statutFilter;

        return matchSearch && matchStatut;
    });

    const handleValider = async (conge) => {

        const confirmAction = window.confirm(
            `Valider le congé de ${conge.employePrenom} ${conge.employeNom} ?`
        );

        if (!confirmAction) return;

        try {

            await validerConge(conge.id);

            setSelectedConge(null);

            fetchConges();

        } catch (error) {

            console.error("Erreur validation congé", error);

            alert("Erreur : quota insuffisant ou demande déjà traitée.");
        }
    };

    const handleRefuser = async (conge) => {

        const confirmAction = window.confirm(
            `Refuser le congé de ${conge.employePrenom} ${conge.employeNom} ?`
        );

        if (!confirmAction) return;

        try {

            await refuserConge(conge.id);

            setSelectedConge(null);

            fetchConges();

        } catch (error) {

            console.error("Erreur refus congé", error);

            alert("Erreur lors du refus de la demande.");
        }
    };

    return (

        <div className="dashboard-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    SGRH
                </div>

                <div className="sidebar-menu">

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh")}
                    >
                        Tableau de bord
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/rh/employes")}
                    >
                        Employés
                    </div>

                    <div className="sidebar-item active">
                        Congés
                    </div>

                    <div className="sidebar-item">
                        Salaires
                    </div>

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

                        <h1>Congés</h1>

                        <p>
                            Traitement et suivi des demandes de congés.
                        </p>

                    </div>

                    <div className="dashboard-user">
                        {email}
                    </div>

                </div>

                <div className="section-card">

                    <div className="section-header">

                        <div>

                            <h2>
                                Demandes de congés
                            </h2>

                            <p className="section-subtitle">
                                Cliquez sur une demande pour consulter les détails.
                            </p>

                        </div>

                        <div className="filters-row">

                            <div className="search-wrapper">

                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Rechercher un employé ou motif..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                            </div>

                            <div className="select-wrapper">

                                <select
                                    className="filter-select"
                                    value={statutFilter}
                                    onChange={(e) => setStatutFilter(e.target.value)}
                                >
                                    <option value="TOUS">
                                        Tous les statuts
                                    </option>

                                    <option value="EN_ATTENTE">
                                        En attente
                                    </option>

                                    <option value="VALIDE">
                                        Validé
                                    </option>

                                    <option value="REFUSE">
                                        Refusé
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                    <div className="table-container">

                        <table className="data-table clickable-table">

                            <thead>

                                <tr>
                                    <th>Employé</th>
                                    <th>Type</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Jours</th>
                                    <th>Motif</th>
                                    <th>Statut</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredConges.map((conge) => (

                                    <tr
                                        key={conge.id}
                                        onClick={() => setSelectedConge(conge)}
                                    >

                                        <td>
                                            {conge.employePrenom} {conge.employeNom}
                                        </td>

                                        <td>
                                            {conge.typeConge}
                                        </td>

                                        <td>
                                            {conge.dateDebut}
                                        </td>

                                        <td>
                                            {conge.dateFin}
                                        </td>

                                        <td>
                                            {conge.nombreJours}
                                        </td>

                                        <td>
                                            {conge.motif}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${conge.statut}`}
                                            >
                                                {conge.statut}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        {filteredConges.length === 0 && (

                            <div className="empty-state">
                                Aucune demande de congé trouvée.
                            </div>

                        )}

                    </div>

                </div>

            </main>

            {selectedConge && (

                <div className="modal-overlay">

                    <div className="modal-card large">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Détails de la demande
                                </h2>

                                <p>
                                    {selectedConge.employePrenom}{" "}
                                    {selectedConge.employeNom}
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedConge(null)}
                            >
                                ×
                            </button>

                        </div>

                        <div className="details-grid">

                            <p>
                                <strong>Employé :</strong>{" "}
                                {selectedConge.employePrenom}{" "}
                                {selectedConge.employeNom}
                            </p>

                            <p>
                                <strong>Type :</strong>{" "}
                                {selectedConge.typeConge}
                            </p>

                            <p>
                                <strong>Date début :</strong>{" "}
                                {selectedConge.dateDebut}
                            </p>

                            <p>
                                <strong>Date fin :</strong>{" "}
                                {selectedConge.dateFin}
                            </p>

                            <p>
                                <strong>Nombre de jours :</strong>{" "}
                                {selectedConge.nombreJours}
                            </p>

                            <p>
                                <strong>Statut :</strong>{" "}
                                {selectedConge.statut}
                            </p>

                            <p>
                                <strong>Motif :</strong>{" "}
                                {selectedConge.motif}
                            </p>

                        </div>

                        {selectedConge.statut === "EN_ATTENTE" && (

                            <div className="modal-actions">

                                <button
                                    className="action-button"
                                    onClick={() => handleValider(selectedConge)}
                                >
                                    Valider
                                </button>

                                <button
                                    className="action-button danger-button"
                                    onClick={() => handleRefuser(selectedConge)}
                                >
                                    Refuser
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default CongesRH;