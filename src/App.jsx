import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PublicLink from "./pages/PublicLink";
import UrlProvider from "./context";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader } from "lucide-react";
import LinkPage from "./pages/LinkPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <ProtectedRoute>
            <LinkPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/:id",
    element: <PublicLink />,
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider
        router={router}
        fallbackElement={
          <Loader
            className="flex justify-center items-center animate-spin stroke-yellow-700 h-[72.8vh] mx-auto"
            size={100}
          />
        }
      />
    </UrlProvider>
  );
}

export default App;
