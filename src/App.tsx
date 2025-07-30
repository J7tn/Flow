import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  const appRoutes = [
    {
      path: "/",
      element: <Home />,
    },
  ];

  const allRoutes = [
    ...appRoutes,
    ...(import.meta.env.VITE_TEMPO === "true" ? routes : []),
  ];

  const element = useRoutes(allRoutes);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {element}
    </Suspense>
  );
}

export default App;
