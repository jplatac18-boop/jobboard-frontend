// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterCandidate from "./pages/RegisterCandidate";
import RegisterCompany from "./pages/RegisterCompany";
import CompanyDashboard from "./pages/CompanyDashboard";
import MyApplications from "./pages/MyApplications";
import JobDetail from "./pages/JobDetail";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Help from "./pages/Help";
import CompanyProfile from "./pages/CompanyProfile"; 
import CompanyPublic from "./pages/CompanyPublic";

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterCandidate />} />
          <Route path="/register-company" element={<RegisterCompany />} />
          <Route path="/help" element={<Help />} />
          <Route path="/companies/:id" element={<CompanyPublic />} />

          {/* Solo candidatos */}
          <Route element={<PrivateRoute allowedRoles={["CANDIDATE"]} />}>
            <Route path="/applications" element={<MyApplications />} />
          </Route>

          {/* Solo empresas */}
          <Route element={<PrivateRoute allowedRoles={["COMPANY"]} />}>
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/profile" element={<CompanyProfile />} /> {/* ⬅️ nueva ruta */}
          </Route>

          {/* Solo admin */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
