
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import WorkspacePage from "./pages/workspace/WorkspacePage";
import InsightsPage from "./pages/insights/InsightsPage";

function AppContent() {
  const { login, register, logout, token } = useAuth();

  const [page, setPage] = useState(
    token ? "dashboard" : "login"
  );

  const [selectedWorkspaceId, setSelectedWorkspaceId] =
    useState(null);

  const handleLogin = async (email, password) => {
    await login(email, password);
    setPage("dashboard");
  };

  const handleRegister = async (
    name,
    email,
    password
  ) => {
    await register(name, email, password);

    alert(
      "Account created successfully! Please login."
    );

    setPage("login");
  };

  const handleLogout = () => {
    logout();
    setSelectedWorkspaceId(null);
    setPage("login");
  };

  const handleOpenInsights = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
    setPage("insights");
  };

  if (page === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onLogin={() => setPage("login")}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <DashboardPage
        onOpenWorkspace={() => setPage("workspace")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "workspace") {
    return (
      <WorkspacePage
        onBack={() => setPage("dashboard")}
        onOpenInsights={handleOpenInsights}
      />
    );
  }

  if (page === "insights") {
    return (
      <InsightsPage
        workspaceId={selectedWorkspaceId}
        onBack={() => setPage("workspace")}
      />
    );
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

