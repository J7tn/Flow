import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import MyWorkflows from "./components/MyWorkflows";
import FlowTemplates from "./components/FlowTemplates";
import Analytics from "./components/Analytics";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workflows" element={<MyWorkflows />} />
          <Route path="/templates" element={<FlowTemplates />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
