import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { EmailConfirmation } from "./components/auth/EmailConfirmation";
import { LandingPage } from "./components/LandingPage";
import Home from "./components/home";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import MyWorkflows from "./components/MyWorkflows";
import FlowTemplates from "./components/FlowTemplates";
import { TemplateDetail } from "./components/templates/TemplateDetail";
import Analytics from "./components/Analytics";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";
import WorkflowDesigner from "./components/workflow/WorkflowDesigner";

function App() {
  const appRoutes = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Signup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/confirm-email",
      element: (
        <ProtectedRoute requireAuth={false}>
          <EmailConfirmation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/calendar",
      element: (
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/workflows",
      element: (
        <ProtectedRoute>
          <MyWorkflows />
        </ProtectedRoute>
      ),
    },
    {
      path: "/templates",
      element: <FlowTemplates />,
    },
    {
      path: "/templates/:id",
      element: <TemplateDetail />,
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      ),
    },
    {
      path: "/workflow/new",
      element: (
        <ProtectedRoute>
          <WorkflowDesigner />
        </ProtectedRoute>
      ),
    },
    {
      path: "/workflow/design",
      element: (
        <ProtectedRoute>
          <WorkflowDesigner />
        </ProtectedRoute>
      ),
    },
  ];

  const allRoutes = appRoutes;

  const element = useRoutes(allRoutes);

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>
    </AuthProvider>
  );
}

export default App;
