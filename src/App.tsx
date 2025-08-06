import { Suspense } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { EmailConfirmation } from "./components/auth/EmailConfirmation";
import { BypassLogin } from "./components/auth/BypassLogin";
import { LandingPage } from "./components/LandingPage";
import { Features } from "./components/Features";
import { Pricing } from "./components/Pricing";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import Home from "./components/home";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import MyFlows from "./components/MyFlows";
import FlowTemplates from "./components/FlowTemplates";
import SavedTemplates from "./components/SavedTemplates";
import { TemplateDetail } from "./components/templates/TemplateDetail";
import Analytics from "./components/Analytics";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";
import FlowDesigner from "./components/workflow/FlowDesigner";
import SharedFlowViewer from "./components/workflow/SharedFlowViewer";
import { TestNestedFlows } from "./components/workflow/TestNestedFlows";
import { TemplateTest } from "./components/TemplateTest";
import { Toaster } from "./components/ui/toaster";
import { PageTransition } from "./components/PageTransition";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { usePageTransition } from "./hooks/usePageTransition";
import { useScrollToTop } from "./hooks/useScrollToTop";

// Wrapper component that uses the scroll hook
function AppContent() {
  const location = useLocation();
  const { transitionType } = usePageTransition();
  useScrollToTop();
  
  const appRoutes = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/features",
      element: <Features />,
    },
    {
      path: "/pricing",
      element: <Pricing />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/contact",
      element: <Contact />,
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
      path: "/friend",
      element: <BypassLogin />,
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
      path: "/flows",
      element: (
        <ProtectedRoute>
          <MyFlows />
        </ProtectedRoute>
      ),
    },
    {
      path: "/templates",
      element: <FlowTemplates />,
    },
    {
      path: "/saved-templates",
      element: (
        <ProtectedRoute>
          <SavedTemplates />
        </ProtectedRoute>
      ),
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
          <FlowDesigner />
        </ProtectedRoute>
      ),
    },
    {
      path: "/workflow/design",
      element: (
        <ProtectedRoute>
          <FlowDesigner />
        </ProtectedRoute>
      ),
    },
    {
      path: "/flow/share/:encodedData",
      element: <SharedFlowViewer />,
    },
    {
      path: "/template-test",
      element: (
        <ProtectedRoute>
          <TemplateTest />
        </ProtectedRoute>
      ),
    },
    {
      path: "/test-nested-flows",
      element: (
        <ProtectedRoute>
          <TestNestedFlows />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  const allRoutes = appRoutes;

  const element = useRoutes(allRoutes);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname} transitionType={transitionType}>
        <Suspense fallback={<LoadingSpinner />}>
          {element}
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
