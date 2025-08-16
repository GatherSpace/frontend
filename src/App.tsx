import { useEffect } from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import SpaceLayout from "./layouts/SpaceLayout";
import LandingLayout from "./layouts/LandingLayout";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const isAuthenticated = Cookies.get("accessToken") && Cookies.get("refreshToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/signin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null;
};

interface LoggedInCheckProps {
  element: React.ReactElement;
  path: string;
}

const LoggedInCheck = ({ element, path }: LoggedInCheckProps) => {
  const isAuthenticated = Cookies.get("accessToken") && Cookies.get("refreshToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? null : element;
};

const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/dashboard/*"
              element={<ProtectedRoute element={<DashboardLayout />} />}
            />
            <Route
              path="/"
              element={<LoggedInCheck element={<LandingLayout />} path="/" />}
            />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route
              path="/space/*"
              element={<ProtectedRoute element={<SpaceLayout />} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
