import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllOffres,
    createOffre,
    updateOffre,
    fermerOffre,
} from "../services/offreEmploiService";
import { getAllDepartements } from "../services/departementService";
import { getAllPostes } from "../services/posteService";
import "../styles/dashboard.css";

function OffresEmploiRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const today = new Date().toISOString().split("T")[0];

    const [offres, setOffres] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [postes, setPostes] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statutFilter, setStatutFilter] = useState("TOUS");

    const [selectedOffre, setSelectedOffre] = useState(null);
    const [editOffre, setEditOffre] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newOffre, setNewOffre] = useState({
        titre: "",
        description: "",
        salairePropose: "",
        dateLimite: "",
        typeContrat: "CDI",
        statut: "OUVERTE",
        departementId: "",
        posteId: "",
    });

    const postesParDepartement = {
        1: [1],
        2: [2],
        3: [3],
        4: [4],
        5: [5],
        6: [6],
    };

    const getPostesFiltres = (departementId) => {
        if (!departementId) return [];

        const idsPostesAutorises =
            postesParDepartement[Number(departementId)] || [];

        return postes.filter((poste) =>
            idsPostesAutorises.includes(Number(poste.id))
        );
    };

    const isDateLimiteValide = (dateLimite) => {
        if (!dateLimite) return false;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const selectedDate = new Date(dateLimite);
        selectedDate.setHours(0, 0, 0, 0);

        return selectedDate >= currentDate;
    };

    const fetchOffres = async () => {
        try {
            const data = await getAllOffres();
            const sortedData = [...data].sort((a, b) => b.id - a.id);
            setOffres(sortedData);
        } catch (error) {
            console.error("Erreur chargement offres", error);
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
        fetchOffres();
        fetchReferentiels();
    }, []);

    const filteredOffres = offres.filter((offre) => {
        const search = searchTerm.toLowerCase();

        const fullText = `
            ${offre.titre || ""}
            ${offre.description || ""}
            ${offre.departementNom || ""}
            ${offre.posteLibelle || ""}
            ${offre.typeContrat || ""}
            ${offre.statut || ""}
        `.toLowerCase();

        const matchSearch = fullText.includes(search);

        const matchStatut =
            statutFilter === "TOUS" || offre.statut === statutFilter;

        return matchSearch && matchStatut;
    });

    const resetNewOffreForm = () => {
        setNewOffre({
            titre: "",
            description: "",
            salairePropose: "",
            dateLimite: "",
            typeContrat: "CDI",
            statut: "OUVERTE",
            departementId: "",
            posteId: "",
        });
    };

    const handleNewOffreChange = (field, value) => {
        if (field === "departementId") {
            setNewOffre({
                ...newOffre,
                departementId: value,
                posteId: "",
            });
            return;
        }

        setNewOffre({
            ...newOffre,
            [field]: value,
        });
    };

    const handleEditOffreChange = (field, value) => {
        if (field === "departementId") {
            setEditOffre({
                ...editOffre,
                departementId: value,
                posteId: "",
            });
            return;
        }

        setEditOffre({
            ...editOffre,
            [field]: value,
        });
    };

    const handleCreateOffre = async (e) => {
        e.preventDefault();

        if (!isDateLimiteValide(newOffre.dateLimite)) {
            alert("La date limite doit être supérieure ou égale à la date d'aujourd'hui.");
            return;
        }

        try {
            const offreToCreate = {
                ...newOffre,
                salairePropose: Number(newOffre.salairePropose),
                departementId: Number(newOffre.departementId),
                posteId: Number(newOffre.posteId),
            };

            await createOffre(offreToCreate);

            setShowAddModal(false);
            resetNewOffreForm();
            fetchOffres();
        } catch (error) {
            console.error("Erreur création offre", error);
            alert("Erreur lors de la création de l'offre.");
        }
    };

    const handleUpdateOffre = async (e) => {
        e.preventDefault();

        if (!isDateLimiteValide(editOffre.dateLimite)) {
            alert("La date limite doit être supérieure ou égale à la date d'aujourd'hui.");
            return;
        }

        try {
            const offreToUpdate = {
                ...editOffre,
                salairePropose: Number(editOffre.salairePropose),
                departementId: Number(editOffre.departementId),
                posteId: Number(editOffre.posteId),
            };

            await updateOffre(editOffre.id, offreToUpdate);

            setEditOffre(null);
            setSelectedOffre(null);
            fetchOffres();
        } catch (error) {
            console.error("Erreur modification offre", error);
            alert("Erreur lors de la modification de l'offre.");
        }
    };

    const handleFermerOffre = async (offre) => {
        const confirmAction = window.confirm(
            `Voulez-vous vraiment fermer l'offre "${offre.titre}" ?`
        );

        if (!confirmAction) return;

        try {
            await fermerOffre(offre.id);
            setSelectedOffre(null);
            fetchOffres();
        } catch (error) {
            console.error("Erreur fermeture offre", error);
            alert("Erreur lors de la fermeture de l'offre.");
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case "OUVERTE":
                return "Ouverte";
            case "FERMEE":
                return "Fermée";
            default:
                return statut;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

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

                    <div className="sidebar-item active">
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
                        <h1>Offres d'emploi</h1>
                        <p>Création et suivi des offres publiées par le service RH.</p>
                    </div>

                    <div className="dashboard-user">{email}</div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Liste des offres</h2>
                            <p className="section-subtitle">
                                Le RH peut créer, modifier et fermer les offres d'emploi.
                            </p>
                        </div>

                        <button
                            className="action-button"
                            type="button"
                            onClick={() => setShowAddModal(true)}
                        >
                            Nouvelle offre
                        </button>
                    </div>

                    <div className="filters-row employee-filters">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Rechercher une offre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="filter-select"
                            value={statutFilter}
                            onChange={(e) => setStatutFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les statuts</option>
                            <option value="OUVERTE">Ouvertes</option>
                            <option value="FERMEE">Fermées</option>
                        </select>
                    </div>

                    <div className="table-container">
                        <table className="data-table clickable-table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Département</th>
                                    <th>Poste</th>
                                    <th>Contrat</th>
                                    <th>Salaire</th>
                                    <th>Date limite</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOffres.map((offre) => (
                                    <tr
                                        key={offre.id}
                                        onClick={() => setSelectedOffre(offre)}
                                    >
                                        <td>{offre.titre}</td>
                                        <td>{offre.departementNom}</td>
                                        <td>{offre.posteLibelle}</td>
                                        <td>{offre.typeContrat}</td>
                                        <td>{offre.salairePropose} DH</td>
                                        <td>{offre.dateLimite}</td>
                                        <td>
                                            <span className={`status-badge ${offre.statut}`}>
                                                {getStatutLabel(offre.statut)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredOffres.length === 0 && (
                            <div className="empty-state">
                                Aucune offre trouvée.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedOffre && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>{selectedOffre.titre}</h2>
                                <p>Détails de l'offre d'emploi</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedOffre(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <p><strong>Titre :</strong> {selectedOffre.titre}</p>
                            <p><strong>Département :</strong> {selectedOffre.departementNom}</p>
                            <p><strong>Poste :</strong> {selectedOffre.posteLibelle}</p>
                            <p><strong>Type contrat :</strong> {selectedOffre.typeContrat}</p>
                            <p><strong>Salaire proposé :</strong> {selectedOffre.salairePropose} DH</p>
                            <p><strong>Date publication :</strong> {selectedOffre.datePublication}</p>
                            <p><strong>Date limite :</strong> {selectedOffre.dateLimite}</p>
                            <p><strong>Statut :</strong> {getStatutLabel(selectedOffre.statut)}</p>
                            <p className="full-width">
                                <strong>Description :</strong> {selectedOffre.description}
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="action-button"
                                onClick={() => {
                                    setEditOffre(selectedOffre);
                                    setSelectedOffre(null);
                                }}
                            >
                                Modifier
                            </button>

                            {selectedOffre.statut === "OUVERTE" && (
                                <button
                                    className="action-button danger-button"
                                    onClick={() => handleFermerOffre(selectedOffre)}
                                >
                                    Fermer l'offre
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {editOffre && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier offre</h2>
                                <p>Modification des informations de l'offre.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setEditOffre(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateOffre} className="form-grid">
                            <div className="form-field">
                                <label>Titre</label>
                                <input
                                    value={editOffre.titre || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("titre", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire proposé</label>
                                <input
                                    type="number"
                                    value={editOffre.salairePropose || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("salairePropose", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Date limite</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={editOffre.dateLimite || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("dateLimite", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Type de contrat</label>
                                <select
                                    value={editOffre.typeContrat || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("typeContrat", e.target.value)
                                    }
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="STAGE">STAGE</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Statut</label>
                                <select
                                    value={editOffre.statut || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("statut", e.target.value)
                                    }
                                >
                                    <option value="OUVERTE">OUVERTE</option>
                                    <option value="FERMEE">FERMEE</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Département</label>
                                <select
                                    value={editOffre.departementId || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("departementId", e.target.value)
                                    }
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
                                    value={editOffre.posteId || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("posteId", e.target.value)
                                    }
                                    disabled={!editOffre.departementId}
                                    required
                                >
                                    <option value="">Sélectionner un poste</option>

                                    {getPostesFiltres(editOffre.departementId).map((poste) => (
                                        <option key={poste.id} value={poste.id}>
                                            {poste.libelle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label>Description</label>
                                <input
                                    value={editOffre.description || ""}
                                    onChange={(e) =>
                                        handleEditOffreChange("description", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Enregistrer
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => setEditOffre(null)}
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
                                <h2>Nouvelle offre</h2>
                                <p>Création d'une offre d'emploi par le service RH.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewOffreForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateOffre} className="form-grid">
                            <div className="form-field">
                                <label>Titre</label>
                                <input
                                    value={newOffre.titre}
                                    onChange={(e) =>
                                        handleNewOffreChange("titre", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire proposé</label>
                                <input
                                    type="number"
                                    value={newOffre.salairePropose}
                                    onChange={(e) =>
                                        handleNewOffreChange("salairePropose", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Date limite</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={newOffre.dateLimite}
                                    onChange={(e) =>
                                        handleNewOffreChange("dateLimite", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Type de contrat</label>
                                <select
                                    value={newOffre.typeContrat}
                                    onChange={(e) =>
                                        handleNewOffreChange("typeContrat", e.target.value)
                                    }
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="STAGE">STAGE</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Département</label>
                                <select
                                    value={newOffre.departementId}
                                    onChange={(e) =>
                                        handleNewOffreChange("departementId", e.target.value)
                                    }
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
                                    value={newOffre.posteId}
                                    onChange={(e) =>
                                        handleNewOffreChange("posteId", e.target.value)
                                    }
                                    disabled={!newOffre.departementId}
                                    required
                                >
                                    <option value="">Sélectionner un poste</option>

                                    {getPostesFiltres(newOffre.departementId).map((poste) => (
                                        <option key={poste.id} value={poste.id}>
                                            {poste.libelle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field full-width">
                                <label>Description</label>
                                <input
                                    value={newOffre.description}
                                    onChange={(e) =>
                                        handleNewOffreChange("description", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Créer l'offre
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewOffreForm();
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

export default OffresEmploiRH;