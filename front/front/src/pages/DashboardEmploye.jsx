import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { getEmployeConnecte } from "../services/employeService";
import {
    getCongesByEmploye,
    demanderConge,
    annulerConge,
} from "../services/congeService";
import { getFichesPaieByEmploye } from "../services/fichePaieService";
import "../styles/dashboard.css";

function DashboardEmploye() {
    const email = localStorage.getItem("email");

    const [activeTab, setActiveTab] = useState("ESPACE");
    const [employe, setEmploye] = useState(null);
    const [conges, setConges] = useState([]);
    const [fichesPaie, setFichesPaie] = useState([]);

    const [showCongeModal, setShowCongeModal] = useState(false);
    const [selectedFiche, setSelectedFiche] = useState(null);

    const [statutFilter, setStatutFilter] = useState("TOUS");
    const [paieMoisFilter, setPaieMoisFilter] = useState("TOUS");
    const [paieAnneeFilter, setPaieAnneeFilter] = useState("TOUS");

    const [newConge, setNewConge] = useState({
        dateDebut: "",
        dateFin: "",
        nombreJours: "",
        motif: "",
        typeConge: "ANNUEL",
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

    const today = new Date().toISOString().split("T")[0];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        window.location.href = "/";
    };

    const fetchEmployeData = async () => {
        try {
            const employeData = await getEmployeConnecte();
            setEmploye(employeData);

            const congesData = await getCongesByEmploye(employeData.id);
            setConges([...congesData].sort((a, b) => b.id - a.id));

            const fichesData = await getFichesPaieByEmploye(employeData.id);
            setFichesPaie([...fichesData].sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Erreur chargement espace employé", error);
        }
    };

    useEffect(() => {
        fetchEmployeData();
    }, []);

    const calculateNombreJours = (dateDebut, dateFin) => {
        if (!dateDebut || !dateFin) return "";

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        const difference = fin.getTime() - debut.getTime();

        if (difference < 0) return "";

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

        if (!newConge.dateDebut || !newConge.dateFin) {
            alert("Veuillez renseigner les dates.");
            return;
        }

        if (newConge.dateDebut < today) {
            alert("La date de début ne peut pas être dans le passé.");
            return;
        }

        if (!newConge.nombreJours || Number(newConge.nombreJours) <= 0) {
            alert("Les dates de congé sont invalides.");
            return;
        }

        if (Number(newConge.nombreJours) > Number(employe.quotaAnnuelConges)) {
            alert(
                `Demande impossible : vous avez seulement ${employe.quotaAnnuelConges} jour(s) de congé restant(s).`
            );
            return;
        }

        try {
            await demanderConge({
                ...newConge,
                nombreJours: Number(newConge.nombreJours),
                employeId: employe.id,
            });

            setShowCongeModal(false);
            resetCongeForm();
            fetchEmployeData();
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
            fetchEmployeData();
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

    const getDemandesEnAttente = () => {
        return conges.filter((conge) => conge.statut === "EN_ATTENTE").length;
    };

    const getCongesValides = () => {
        return conges
            .filter((conge) => conge.statut === "VALIDE")
            .reduce((total, conge) => total + Number(conge.nombreJours || 0), 0);
    };

    const getAnciennete = () => {
        if (!employe || !employe.dateEmbauche) return "-";

        const dateEmbauche = new Date(employe.dateEmbauche);
        const currentDate = new Date();

        let years = currentDate.getFullYear() - dateEmbauche.getFullYear();
        let months = currentDate.getMonth() - dateEmbauche.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years <= 0) return `${months} mois`;

        return `${years} an(s) ${months} mois`;
    };

    const filteredConges = conges.filter((conge) => {
        if (statutFilter === "TOUS") return true;
        return conge.statut === statutFilter;
    });

    const anneesPaieDisponibles = [
        ...new Set(fichesPaie.map((fiche) => fiche.annee)),
    ].sort((a, b) => b - a);

    const filteredFichesPaie = fichesPaie.filter((fiche) => {
        const matchMois =
            paieMoisFilter === "TOUS" ||
            Number(fiche.mois) === Number(paieMoisFilter);

        const matchAnnee =
            paieAnneeFilter === "TOUS" ||
            Number(fiche.annee) === Number(paieAnneeFilter);

        return matchMois && matchAnnee;
    });

    const handleDownloadPdf = (fiche) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("FICHE DE PAIE", 80, 20);

        doc.setFontSize(11);
        doc.text(`N° fiche : ${fiche.numeroFiche}`, 20, 35);
        doc.text(`Date génération : ${fiche.dateGeneration}`, 20, 43);

        doc.setFontSize(14);
        doc.text("Informations employé", 20, 60);

        doc.setFontSize(11);
        doc.text(`Employé : ${fiche.employePrenom} ${fiche.employeNom}`, 20, 72);
        doc.text(`Email : ${fiche.employeEmail || "-"}`, 20, 80);
        doc.text(`Téléphone : ${fiche.employeTelephone || "-"}`, 20, 88);
        doc.text(`Département : ${fiche.departementNom || "-"}`, 20, 96);
        doc.text(`Poste : ${fiche.posteLibelle || "-"}`, 20, 104);
        doc.text(`Contrat : ${fiche.typeContrat || "-"}`, 20, 112);

        doc.setFontSize(14);
        doc.text("Détails de paie", 20, 132);

        doc.setFontSize(11);
        doc.text(`Mois : ${moisLabels[fiche.mois]}`, 20, 144);
        doc.text(`Année : ${fiche.annee}`, 20, 152);
        doc.text(`Salaire brut : ${fiche.salaireBrut} DH`, 20, 164);
        doc.text(`Primes : ${fiche.primes} DH`, 20, 172);
        doc.text(`Déductions : ${fiche.deductions} DH`, 20, 180);

        doc.setFontSize(13);
        doc.text(`Salaire net : ${fiche.salaireNet} DH`, 20, 195);

        doc.setFontSize(10);
        doc.text("Document généré automatiquement par le système SGRH.", 20, 275);

        doc.save(`${fiche.numeroFiche || "fiche-paie"}.pdf`);
    };

    const handlePrintFiche = () => {
        window.print();
    };

    const handleSignalerAnomalie = (fiche) => {
        const subject = `Anomalie fiche de paie ${fiche.numeroFiche}`;

        const body = `Bonjour,

Je souhaite signaler une anomalie concernant ma fiche de paie.

Numéro fiche : ${fiche.numeroFiche}
Employé : ${fiche.employePrenom} ${fiche.employeNom}
Mois : ${moisLabels[fiche.mois]} ${fiche.annee}

Description du problème :
`;

        window.location.href = `mailto:rh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SGRH</div>

                <div className="sidebar-menu">
                    <div
                        className={`sidebar-item ${activeTab === "ESPACE" ? "active" : ""}`}
                        onClick={() => setActiveTab("ESPACE")}
                    >
                        Mon espace
                    </div>

                    <div
                        className={`sidebar-item ${activeTab === "CONGES" ? "active" : ""}`}
                        onClick={() => setActiveTab("CONGES")}
                    >
                        Mes congés
                    </div>

                    <div
                        className={`sidebar-item ${activeTab === "PAIE" ? "active" : ""}`}
                        onClick={() => setActiveTab("PAIE")}
                    >
                        Mes fiches de paie
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1>Espace Employé</h1>
                        <p>
                            Consultation de votre profil, de vos congés et de vos fiches de paie.
                        </p>
                    </div>

                    {activeTab === "ESPACE" ? (
                        <div className="dashboard-user-actions">
                            <div className="dashboard-user">{email}</div>

                            <button className="logout-button" onClick={handleLogout}>
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="dashboard-user">{email}</div>
                    )}
                </div>

                {employe && (
                    <>
                        {activeTab === "ESPACE" && (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Congés restants</h3>
                                        <div className="stat-number">
                                            {employe.quotaAnnuelConges}
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <h3>Demandes en attente</h3>
                                        <div className="stat-number">
                                            {getDemandesEnAttente()}
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <h3>Jours de congés validés</h3>
                                        <div className="stat-number">
                                            {getCongesValides()}
                                        </div>
                                    </div>

                                    <div className="stat-card highlight-card">
                                        <h3>Fiches de paie</h3>
                                        <div className="stat-number">
                                            {fichesPaie.length}
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
                                            <p><strong>Département :</strong> {employe.departementNom}</p>
                                            <p><strong>Poste :</strong> {employe.posteLibelle}</p>
                                            <p><strong>Contrat :</strong> {employe.typeContrat}</p>
                                            <p><strong>Statut :</strong> {employe.statut}</p>
                                            <p><strong>Date embauche :</strong> {employe.dateEmbauche}</p>
                                            <p><strong>Ancienneté :</strong> {getAnciennete()}</p>
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

                                        <button
                                            className="action-button secondary"
                                            onClick={() => setActiveTab("CONGES")}
                                        >
                                            Voir mes congés
                                        </button>

                                        <button
                                            className="action-button secondary"
                                            onClick={() => setActiveTab("PAIE")}
                                        >
                                            Voir mes fiches de paie
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "CONGES" && (
                            <div className="section-card">
                                <div className="section-header">
                                    <div>
                                        <h2>Mes demandes de congés</h2>
                                        <p className="section-subtitle">
                                            Suivi de vos demandes envoyées au service RH.
                                        </p>
                                    </div>

                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <select
                                            className="filter-select"
                                            value={statutFilter}
                                            onChange={(e) => setStatutFilter(e.target.value)}
                                            style={{ minWidth: "180px" }}
                                        >
                                            <option value="TOUS">Tous les statuts</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="VALIDE">Validés</option>
                                            <option value="REFUSE">Refusés</option>
                                        </select>

                                        <button
                                            className="action-button"
                                            type="button"
                                            onClick={() => setShowCongeModal(true)}
                                            style={{ width: "220px", marginBottom: 0 }}
                                        >
                                            Nouvelle demande
                                        </button>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "20px",
                                        padding: "16px",
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        color: "#1e293b",
                                    }}
                                >
                                    Quota restant : {employe.quotaAnnuelConges} jour(s)
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
                                            {filteredConges.map((conge) => (
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

                                    {filteredConges.length === 0 && (
                                        <div className="empty-state">
                                            Aucune demande de congé trouvée.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "PAIE" && (
                            <div className="section-card">
                                <div className="section-header">
                                    <div>
                                        <h2>Mes fiches de paie</h2>
                                        <p className="section-subtitle">
                                            Consultation de vos fiches de paie générées par le service RH.
                                        </p>
                                    </div>
                                </div>

                                <div className="filters-row employee-filters">
                                    <select
                                        className="filter-select"
                                        value={paieMoisFilter}
                                        onChange={(e) => setPaieMoisFilter(e.target.value)}
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
                                        value={paieAnneeFilter}
                                        onChange={(e) => setPaieAnneeFilter(e.target.value)}
                                    >
                                        <option value="TOUS">Toutes les années</option>

                                        {anneesPaieDisponibles.map((annee) => (
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
                                                <th>Mois</th>
                                                <th>Année</th>
                                                <th>Salaire brut</th>
                                                <th>Primes</th>
                                                <th>Déductions</th>
                                                <th>Salaire net</th>
                                                <th>Date génération</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredFichesPaie.map((fiche) => (
                                                <tr
                                                    key={fiche.id}
                                                    onClick={() => setSelectedFiche(fiche)}
                                                >
                                                    <td>{fiche.numeroFiche}</td>
                                                    <td>{moisLabels[fiche.mois]}</td>
                                                    <td>{fiche.annee}</td>
                                                    <td>{fiche.salaireBrut} DH</td>
                                                    <td>{fiche.primes} DH</td>
                                                    <td>{fiche.deductions} DH</td>
                                                    <td>{fiche.salaireNet} DH</td>
                                                    <td>{fiche.dateGeneration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredFichesPaie.length === 0 && (
                                        <div className="empty-state">
                                            Aucune fiche de paie trouvée.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
                                    min={today}
                                    value={newConge.dateDebut}
                                    onChange={(e) => handleCongeChange("dateDebut", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Date fin</label>
                                <input
                                    type="date"
                                    min={newConge.dateDebut || today}
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
                                onClick={() => handleDownloadPdf(selectedFiche)}
                            >
                                Télécharger PDF
                            </button>

                            <button
                                className="action-button secondary"
                                onClick={handlePrintFiche}
                            >
                                Imprimer
                            </button>

                            <button
                                className="action-button secondary"
                                onClick={() => handleSignalerAnomalie(selectedFiche)}
                            >
                                Signaler anomalie
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardEmploye;