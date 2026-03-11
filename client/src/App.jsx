import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import HomePage from "./HomePage";
import InventoryDetails from "./InventoryDetails";
import AdminPanel from "./AdminPanel";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AdminRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/:id"
        element={
          <ProtectedRoute>
            <InventoryDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;