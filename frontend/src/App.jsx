import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Analytics from "./pages/Analytics";
import SmartMatches from "./pages/SmartMatches";
import VerifyClaim from "./pages/VerifyClaim";
import Notifications from "./pages/Notifications";
import LostItemDetail from "./pages/LostItemDetail";
import FoundItemDetail from "./pages/FoundItemDetail";
import UserManagement from "./pages/UserManagement";
import PermissionMatrix from "./pages/PermissionMatrix";

// Convenience wrapper: a guarded route inside the app Layout.
function Guarded({ module, element }) {
  return <ProtectedRoute module={module}>{element}</ProtectedRoute>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Guarded module="dashboard" element={<Dashboard />} />} />
                <Route path="/lost-items" element={<Guarded module="lost_items" element={<LostItems />} />} />
                <Route path="/found-items" element={<Guarded module="found_items" element={<FoundItems />} />} />
                <Route path="/matches" element={<Guarded module="matches" element={<SmartMatches />} />} />
                <Route path="/verify" element={<Guarded module="verify" element={<VerifyClaim />} />} />
                <Route path="/notifications" element={<Guarded module="notifications" element={<Notifications />} />} />
                <Route path="/analytics" element={<Guarded module="analytics" element={<Analytics />} />} />
                <Route path="/lost-item/:id" element={<Guarded module="lost_items" element={<LostItemDetail />} />} />
                <Route path="/found-item/:id" element={<Guarded module="found_items" element={<FoundItemDetail />} />} />
                <Route path="/user-management" element={<Guarded module="users" element={<UserManagement />} />} />
                <Route path="/permission-matrix" element={<Guarded module="roles" element={<PermissionMatrix />} />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
