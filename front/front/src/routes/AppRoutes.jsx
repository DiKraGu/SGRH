import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import DashboardAdmin from "../pages/DashboardAdmin";
import DashboardRH from "../pages/DashboardRH";
import DashboardEmploye from "../pages/DashboardEmploye";
import Unauthorized from "../pages/Unauthorized";

import CandidaturesRH from "../pages/CandidaturesRH";
import EmployesRH from "../pages/EmployesRH";
import CongesRH from "../pages/CongesRH";
import OffresEmploiRH from "../pages/OffresEmploiRH";
import SalairesRH from "../pages/SalairesRH";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <DashboardAdmin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rh"
                    element={
                        <ProtectedRoute allowedRoles={["RH"]}>
                            <DashboardRH />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rh/employes"
                    element={
                        <ProtectedRoute allowedRoles={["RH"]}>
                            <EmployesRH />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rh/conges"
                    element={
                        <ProtectedRoute allowedRoles={["RH"]}>
                            <CongesRH />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rh/offres"
                    element={
                        <ProtectedRoute allowedRoles={["RH"]}>
                            <OffresEmploiRH />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rh/candidatures"
                    element={
                        <ProtectedRoute allowedRoles={["RH"]}>
                            <CandidaturesRH />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employe"
                    element={
                        <ProtectedRoute allowedRoles={["EMPLOYE"]}>
                            <DashboardEmploye />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/rh/salaires"
    element={
        <ProtectedRoute allowedRoles={["RH"]}>
            <SalairesRH />
        </ProtectedRoute>
    }
/>

                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            
        </BrowserRouter>
    );
}

export default AppRoutes;