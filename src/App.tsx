import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./components/home";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import MyWorkflows from "./components/MyWorkflows";
import FlowTemplates from "./components/FlowTemplates";
import Analytics from "./components/Analytics";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";

function App() {
  const appRoutes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/calendar",
      element: <Calendar />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/workflows",
      element: <MyWorkflows />,
    },
    {
      path: "/templates",
      element: <FlowTemplates />,
    },
    {
      path: "/analytics",
      element: <Analytics />,
    },
    {
      path: "/workflow/new",
      element: <WorkflowBuilder />,
    },
  ];

  const allRoutes = appRoutes;

  const element = useRoutes(allRoutes);

  return <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>;
}

export default App;
