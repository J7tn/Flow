import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as needed */}
        <Route path="/workflows" element={<div>Workflows Page</div>} />
        <Route path="/calendar" element={<div>Calendar Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
