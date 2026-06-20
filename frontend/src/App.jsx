import PermissionMatrix from "./pages/PermissionMatrix";
import UserManagement from "./pages/UserManagement";
import FoundItemDetail from "./pages/FoundItemDetail";
import LostItemDetail from "./pages/LostItemDetail";
import Notifications from "./pages/Notifications";
import VerifyClaim from "./pages/VerifyClaim";
import SmartMatches from "./pages/SmartMatches";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Analytics from "./pages/Analytics";

export default function App() {
return ( <ThemeProvider> <AuthProvider> <BrowserRouter> <AnimatePresence mode="wait"> <Routes>

```
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/matches" element={<SmartMatches />} />
            <Route path="/verify" element={<VerifyClaim />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/lost-item/:id" element={<LostItemDetail />} />
            <Route path="/found-item/:id" element={<FoundItemDetail />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/permission-matrix" element={<PermissionMatrix />} />
</Route> 

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  </AuthProvider>
</ThemeProvider>

);
}
