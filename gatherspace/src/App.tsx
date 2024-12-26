import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import AuthLayout from "./layouts/AuthLayout";
import SpaceLayout from "./layouts/SpaceLayout";
import LandingLayout from "./layouts/LandingLayout";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute = ({ element, path }: ProtectedRouteProps) => {
  const isAuthenticated = Cookies.get("token");

    if (!isAuthenticated) {
        return <Navigate to="/auth/signin" replace />;
    }
    return element;
};

const LoggedInCheck = ({ element, path }: any) => {
  const isAuthenticated = Cookies.get("token");

  if (isAuthenticated != null && path === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={LoggedInCheck(<LandingLayout />, "/")}
            />
             <Route path="/auth/*" element={<AuthLayout />} />
             <Route
              path="/dashboard"
              element={<ProtectedRoute element={<DashboardLayout />} path="/dashboard" />}
            />
            <Route
              path="/space/*"
              element={<ProtectedRoute element={<SpaceLayout />} path="/space" />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
