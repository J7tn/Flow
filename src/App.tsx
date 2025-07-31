import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import Home from "./components/home";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import MyWorkflows from "./components/MyWorkflows";
import FlowTemplates from "./components/FlowTemplates";
import { TemplateDetail } from "./components/templates/TemplateDetail";
import Analytics from "./components/Analytics";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";
import Signup from "./components/Signup";
import Subscription from "./components/Subscription";

function App() {
  const appRoutes = [
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
      path: "/",
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
            element: (
              <ProtectedRoute>
                <FlowTemplates />
              </ProtectedRoute>
            ),
          },
          {
            path: "/templates/:id",
            element: (
              <ProtectedRoute>
                <TemplateDetail />
              </ProtectedRoute>
            ),
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
          <WorkflowBuilder />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/subscription",
      element: <Subscription />,
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
