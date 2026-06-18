import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllFichesPaie,
    createFichePaie,
    updateFichePaie,
    deleteFichePaie,
} from "../services/fichePaieService";
import { getAllEmployes } from "../services/employeService";
import "../styles/dashboard.css";

function SalairesRH() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [fichesPaie, setFichesPaie] = useState([]);
    const [employes, setEmployes] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [moisFilter, setMoisFilter] = useState("TOUS");
    const [anneeFilter, setAnneeFilter] = useState("TOUS");

    const [selectedFiche, setSelectedFiche] = useState(null);
    const [editFiche, setEditFiche] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newFiche, setNewFiche] = useState({
        employeId: "",
        mois: "",
        annee: currentYear,
        salaireBrut: "",
        primes: 0,
        deductions: 0,
    });

    const moisLabels = {
        1: "Janvier",
        2: "Février",
        3: "Mars",
        4: "Avril",
        5: "Mai",
        6: "Juin",
        7: "Juillet",
        8: "Août",
        9: "Septembre",
        10: "Octobre",
        11: "Novembre",
        12: "Décembre",
    };

    const anneesDisponibles = [
        ...new Set([
            currentYear,
            ...fichesPaie.map((fiche) => fiche.annee),
        ]),
    ].sort((a, b) => b - a);

   

    const fetchFichesPaie = async () => {
        try {
            const data = await getAllFichesPaie();
            const sortedData = [...data].sort((a, b) => b.id - a.id);
            setFichesPaie(sortedData);
        } catch (error) {
            console.error("Erreur chargement fiches de paie", error);
        }
    };

    const fetchEmployes = async () => {
        try {
            const data = await getAllEmployes();
            const employesActifs = data.filter(
                (employe) => employe.statut === "ACTIF"
            );
            setEmployes(employesActifs);
        } catch (error) {
            console.error("Erreur chargement employés", error);
        }
    };

    useEffect(() => {
        fetchFichesPaie();
        fetchEmployes();
    }, []);

    const isPeriodeValide = (mois, annee) => {
        const selectedMonth = Number(mois);
        const selectedYear = Number(annee);

        if (!selectedMonth || !selectedYear) return false;
        if (selectedYear > currentYear) return false;
        if (selectedYear === currentYear && selectedMonth > currentMonth) return false;

        return true;
    };

    const getMoisDisponiblesPourAnnee = (annee) => {
        const selectedYear = Number(annee);

        return Object.entries(moisLabels).filter(([mois]) => {
            if (selectedYear < currentYear) return true;
            if (selectedYear === currentYear) return Number(mois) <= currentMonth;
            return false;
        });
    };

    const filteredFiches = fichesPaie.filter((fiche) => {
        const search = searchTerm.toLowerCase();

        const fullText = `
            ${fiche.numeroFiche || ""}
            ${fiche.employeNom || ""}
            ${fiche.employePrenom || ""}
            ${fiche.employeEmail || ""}
            ${fiche.departementNom || ""}
            ${fiche.posteLibelle || ""}
            ${fiche.typeContrat || ""}
        `.toLowerCase();

        const matchSearch = fullText.includes(search);
        const matchMois = moisFilter === "TOUS" || Number(fiche.mois) === Number(moisFilter);
        const matchAnnee = anneeFilter === "TOUS" || Number(fiche.annee) === Number(anneeFilter);

        return matchSearch && matchMois && matchAnnee;
    });

    const handleNewFicheChange = (field, value) => {
        if (field === "employeId") {
            const selectedEmploye = employes.find(
                (employe) => String(employe.id) === String(value)
            );

            setNewFiche({
                ...newFiche,
                employeId: value,
                salaireBrut: selectedEmploye ? selectedEmploye.salaireBase : "",
            });

            return;
        }

        if (field === "annee") {
            const selectedYear = Number(value);

            setNewFiche({
                ...newFiche,
                annee: selectedYear,
                mois:
                    selectedYear === currentYear &&
                    Number(newFiche.mois) > currentMonth
                        ? ""
                        : newFiche.mois,
            });

            return;
        }

        setNewFiche({
            ...newFiche,
            [field]: value,
        });
    };

    const handleEditFicheChange = (field, value) => {
        setEditFiche({
            ...editFiche,
            [field]: value,
        });
    };

    const resetNewFicheForm = () => {
        setNewFiche({
            employeId: "",
            mois: "",
            annee: currentYear,
            salaireBrut: "",
            primes: 0,
            deductions: 0,
        });
    };

    const calculateSalaireNet = (fiche) => {
        const salaireBrut = Number(fiche.salaireBrut || 0);
        const primes = Number(fiche.primes || 0);
        const deductions = Number(fiche.deductions || 0);

        return salaireBrut + primes - deductions;
    };

    const handleCreateFiche = async (e) => {
        e.preventDefault();

        if (!newFiche.employeId || !newFiche.mois || !newFiche.annee) {
            alert("Veuillez remplir l'employé, le mois et l'année.");
            return;
        }

        if (!isPeriodeValide(newFiche.mois, newFiche.annee)) {
            alert("Impossible de générer une fiche de paie pour un mois futur.");
            return;
        }

        if (Number(newFiche.salaireBrut) <= 0) {
            alert("Le salaire brut doit être supérieur à 0.");
            return;
        }

        if (Number(newFiche.primes) < 0 || Number(newFiche.deductions) < 0) {
            alert("Les primes et les déductions ne peuvent pas être négatives.");
            return;
        }

        if (calculateSalaireNet(newFiche) < 0) {
            alert("Le salaire net ne peut pas être négatif.");
            return;
        }

        try {
            const ficheToCreate = {
                employeId: Number(newFiche.employeId),
                mois: Number(newFiche.mois),
                annee: Number(newFiche.annee),
                salaireBrut: Number(newFiche.salaireBrut),
                primes: Number(newFiche.primes || 0),
                deductions: Number(newFiche.deductions || 0),
            };

            await createFichePaie(ficheToCreate);

            setShowAddModal(false);
            resetNewFicheForm();
            fetchFichesPaie();
        } catch (error) {
            console.error("Erreur création fiche de paie", error);
            alert("Erreur : une fiche existe peut-être déjà pour cet employé sur ce mois.");
        }
    };

    const handleUpdateFiche = async (e) => {
        e.preventDefault();

        if (!editFiche.mois || !editFiche.annee) {
            alert("Veuillez remplir le mois et l'année.");
            return;
        }

        if (!isPeriodeValide(editFiche.mois, editFiche.annee)) {
            alert("Impossible de modifier une fiche vers un mois futur.");
            return;
        }

        if (Number(editFiche.salaireBrut) <= 0) {
            alert("Le salaire brut doit être supérieur à 0.");
            return;
        }

        if (Number(editFiche.primes) < 0 || Number(editFiche.deductions) < 0) {
            alert("Les primes et les déductions ne peuvent pas être négatives.");
            return;
        }

        if (calculateSalaireNet(editFiche) < 0) {
            alert("Le salaire net ne peut pas être négatif.");
            return;
        }

        try {
            const ficheToUpdate = {
                ...editFiche,
                mois: Number(editFiche.mois),
                annee: Number(editFiche.annee),
                salaireBrut: Number(editFiche.salaireBrut),
                primes: Number(editFiche.primes || 0),
                deductions: Number(editFiche.deductions || 0),
            };

            await updateFichePaie(editFiche.id, ficheToUpdate);

            setEditFiche(null);
            setSelectedFiche(null);
            fetchFichesPaie();
        } catch (error) {
            console.error("Erreur modification fiche de paie", error);
            alert("Erreur : une fiche existe peut-être déjà pour cet employé sur ce mois.");
        }
    };

    const handleDeleteFiche = async (fiche) => {
        const confirmAction = window.confirm(
            `Voulez-vous vraiment supprimer la fiche ${fiche.numeroFiche} ?`
        );

        if (!confirmAction) return;

        try {
            await deleteFichePaie(fiche.id);
            setSelectedFiche(null);
            fetchFichesPaie();
        } catch (error) {
            console.error("Erreur suppression fiche de paie", error);
            alert("Erreur lors de la suppression de la fiche.");
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

                    <div className="sidebar-item" onClick={() => navigate("/rh/employes")}>
                        Employés
                    </div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/conges")}>
                        Congés
                    </div>

                    <div className="sidebar-item active">
                        Salaires
                    </div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/offres")}>
                        Offres d'emploi
                    </div>

                    <div className="sidebar-item" onClick={() => navigate("/rh/candidatures")}>
                        Candidatures
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Salaires</h1>
                        <p>Gestion et génération des fiches de paie des employés.</p>
                    </div>

                    <div className="dashboard-user">{email}</div>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <div>
                            <h2>Fiches de paie</h2>
                            <p className="section-subtitle">
                                Consultez, filtrez et générez les fiches de paie mensuelles.
                            </p>
                        </div>

                        <button
                            className="action-button"
                            type="button"
                            onClick={() => setShowAddModal(true)}
                        >
                            Générer une fiche
                        </button>
                    </div>

                    <div className="filters-row employee-filters">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Rechercher employé, fiche, département..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="filter-select"
                            value={moisFilter}
                            onChange={(e) => setMoisFilter(e.target.value)}
                        >
                            <option value="TOUS">Tous les mois</option>
                            {Object.entries(moisLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={anneeFilter}
                            onChange={(e) => setAnneeFilter(e.target.value)}
                        >
                            <option value="TOUS">Toutes les années</option>

                            {anneesDisponibles.map((annee) => (
                                <option key={annee} value={annee}>
                                    {annee}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="table-container">
                        <table className="data-table clickable-table">
                            <thead>
                                <tr>
                                    <th>N° fiche</th>
                                    <th>Employé</th>
                                    <th>Département</th>
                                    <th>Poste</th>
                                    <th>Mois</th>
                                    <th>Année</th>
                                    <th>Salaire net</th>
                                    <th>Date génération</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredFiches.map((fiche) => (
                                    <tr
                                        key={fiche.id}
                                        onClick={() => setSelectedFiche(fiche)}
                                    >
                                        <td>{fiche.numeroFiche}</td>
                                        <td>{fiche.employePrenom} {fiche.employeNom}</td>
                                        <td>{fiche.departementNom}</td>
                                        <td>{fiche.posteLibelle}</td>
                                        <td>{moisLabels[fiche.mois]}</td>
                                        <td>{fiche.annee}</td>
                                        <td>{fiche.salaireNet} DH</td>
                                        <td>{fiche.dateGeneration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredFiches.length === 0 && (
                            <div className="empty-state">
                                Aucune fiche de paie trouvée.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedFiche && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Fiche de paie</h2>
                                <p>{selectedFiche.numeroFiche}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedFiche(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="details-grid">
                            <p><strong>Employé :</strong> {selectedFiche.employePrenom} {selectedFiche.employeNom}</p>
                            <p><strong>Email :</strong> {selectedFiche.employeEmail || "-"}</p>
                            <p><strong>Téléphone :</strong> {selectedFiche.employeTelephone || "-"}</p>
                            <p><strong>Département :</strong> {selectedFiche.departementNom}</p>
                            <p><strong>Poste :</strong> {selectedFiche.posteLibelle}</p>
                            <p><strong>Contrat :</strong> {selectedFiche.typeContrat}</p>
                            <p><strong>Mois :</strong> {moisLabels[selectedFiche.mois]}</p>
                            <p><strong>Année :</strong> {selectedFiche.annee}</p>
                            <p><strong>Salaire brut :</strong> {selectedFiche.salaireBrut} DH</p>
                            <p><strong>Primes :</strong> {selectedFiche.primes} DH</p>
                            <p><strong>Déductions :</strong> {selectedFiche.deductions} DH</p>
                            <p><strong>Salaire net :</strong> {selectedFiche.salaireNet} DH</p>
                            <p><strong>Date génération :</strong> {selectedFiche.dateGeneration}</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="action-button"
                                onClick={() => {
                                    setEditFiche(selectedFiche);
                                    setSelectedFiche(null);
                                }}
                            >
                                Modifier
                            </button>

                            <button
                                className="action-button danger-button"
                                onClick={() => handleDeleteFiche(selectedFiche)}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editFiche && (
                <div className="modal-overlay">
                    <div className="modal-card large">
                        <div className="modal-header">
                            <div>
                                <h2>Modifier fiche de paie</h2>
                                <p>{editFiche.numeroFiche}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setEditFiche(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateFiche} className="form-grid">
                            <div className="form-field">
                                <label>Mois</label>
                                <select
                                    value={editFiche.mois}
                                    onChange={(e) => handleEditFicheChange("mois", e.target.value)}
                                    required
                                >
                                    {getMoisDisponiblesPourAnnee(editFiche.annee).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Année</label>
                                <input
                                    type="number"
                                    min="2020"
                                    max={currentYear}
                                    value={editFiche.annee}
                                    onChange={(e) => handleEditFicheChange("annee", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire brut</label>
                                <input
                                    type="number"
                                    value={editFiche.salaireBrut}
                                    onChange={(e) => handleEditFicheChange("salaireBrut", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Primes</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editFiche.primes}
                                    onChange={(e) => handleEditFicheChange("primes", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Déductions</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editFiche.deductions}
                                    onChange={(e) => handleEditFicheChange("deductions", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Salaire net calculé</label>
                                <input
                                    type="number"
                                    value={calculateSalaireNet(editFiche)}
                                    readOnly
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Enregistrer
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => setEditFiche(null)}
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
                                <h2>Générer une fiche de paie</h2>
                                <p>Sélectionnez l’employé et renseignez les éléments variables.</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewFicheForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateFiche} className="form-grid">
                            <div className="form-field">
                                <label>Employé</label>
                                <select
                                    value={newFiche.employeId}
                                    onChange={(e) => handleNewFicheChange("employeId", e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner un employé actif</option>

                                    {employes.map((employe) => (
                                        <option key={employe.id} value={employe.id}>
                                            {employe.prenom} {employe.nom} - {employe.posteLibelle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Année</label>
                                <input
                                    type="number"
                                    min="2020"
                                    max={currentYear}
                                    value={newFiche.annee}
                                    onChange={(e) => handleNewFicheChange("annee", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Mois</label>
                                <select
                                    value={newFiche.mois}
                                    onChange={(e) => handleNewFicheChange("mois", e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner un mois</option>

                                    {getMoisDisponiblesPourAnnee(newFiche.annee).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Salaire brut</label>
                                <input
                                    type="number"
                                    value={newFiche.salaireBrut}
                                    onChange={(e) => handleNewFicheChange("salaireBrut", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Primes</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newFiche.primes}
                                    onChange={(e) => handleNewFicheChange("primes", e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Déductions</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newFiche.deductions}
                                    onChange={(e) => handleNewFicheChange("deductions", e.target.value)}
                                />
                            </div>

                            <div className="form-field full-width">
                                <label>Salaire net calculé</label>
                                <input
                                    type="number"
                                    value={calculateSalaireNet(newFiche)}
                                    readOnly
                                />
                            </div>

                            <div className="modal-actions full-width">
                                <button type="submit" className="action-button">
                                    Générer
                                </button>

                                <button
                                    type="button"
                                    className="action-button secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewFicheForm();
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

export default SalairesRH;