import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/react";

import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShipmentsPage from "./pages/ShipmentsPage";

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/shipments" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ClerkProviderWithRoutes>
    </BrowserRouter>
  );
}

function ClerkProviderWithRoutes({ children }) {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <div className="page">
        <h1>Clerk publishable key missing</h1>
        <p className="muted">
          Set VITE_CLERK_PUBLISHABLE_KEY in frontend/.env.local and restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
    >
      {children}
    </ClerkProvider>
  );
}

function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
