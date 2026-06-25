import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilModal from "./ProfilModal";

function HeaderUserActions() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [showProfilModal, setShowProfilModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <>
            <div className="dashboard-user-actions">
                <button
                    type="button"
                    className="dashboard-user"
                    onClick={() => setShowProfilModal(true)}
                >
                    {email}
                </button>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
            </div>

            {showProfilModal && (
                <ProfilModal
                    onClose={() => setShowProfilModal(false)}
                />
            )}
        </>
    );
}

export default HeaderUserActions;