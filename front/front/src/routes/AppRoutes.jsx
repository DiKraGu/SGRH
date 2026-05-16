import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import DashboardAdmin from "../pages/DashboardAdmin";
import DashboardRH from "../pages/DashboardRH";
import DashboardEmploye from "../pages/DashboardEmploye";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/admin" element={<DashboardAdmin />} />

                <Route path="/rh" element={<DashboardRH />} />

                <Route path="/employe" element={<DashboardEmploye />} />

            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes;