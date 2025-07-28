import React from "react";
import { BrowserRouter, Routes as RoutesList, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";

// Layout with Navbar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

// PrivateRoute component
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("expToken");
  return token ? children : <Navigate to="/login" replace />;
};

const Router: React.FC = () => {
  const token = localStorage.getItem("expToken");
  return (
    <BrowserRouter>
      <RoutesList>
        <Route
          path="/"
          element={
            <AppLayout>
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            </AppLayout>
          }
        />
        <Route
          path="/login"
          element={
            !token ? <Login /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !token ? <Register /> : <Navigate to="/" replace />
          }
        />
      </RoutesList>
    </BrowserRouter>
  );
};

export default Router; 