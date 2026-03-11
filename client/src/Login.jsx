import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Fixed admin login
    if (email === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", "admin");
      navigate("/admin");
      return;
    }

    // Normal user login from localStorage
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const user = savedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.removeItem("isAdmin");
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      <div className="container py-5">
        <div className="row align-items-center g-4">
          {/* Left Side */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="fw-bold display-5">Inventory Management System</h1>
              <p className="text-light fs-5 mt-3">
                Manage inventories, users, items, and admin operations from one
                dashboard.
              </p>
            </div>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Social Login</h5>
                    <p className="card-text small">
                      Google or Facebook login can be integrated here later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">User Management</h5>
                    <p className="card-text small">
                      Users can register, login, and manage their account
                      access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Admin Panel</h5>
                    <p className="card-text small">
                      Admin can manage users and control the system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Inventory System</h5>
                    <p className="card-text small">
                      Create inventories, manage items, and view details easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-lg-6">
            <div className="card bg-secondary text-white shadow border-0">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4 fw-bold">Login</h2>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Email or admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleLogin}
                >
                  Login
                </button>

                <p className="text-center mb-2">
                  <Link
                    to="/forgot-password"
                    className="text-warning text-decoration-none"
                  >
                    Forgot Password?
                  </Link>
                </p>

                <p className="text-center mb-3">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-info text-decoration-none"
                  >
                    Register
                  </Link>
                </p>

                <hr />

                <div className="text-center">
                  <h6 className="text-warning mb-2">Demo Admin Login</h6>
                  <p className="mb-1 small">Username: admin</p>
                  <p className="mb-0 small">Password: admin123</p>
                </div>

                <div className="mt-4">
                  <button className="btn btn-outline-light w-100 mb-2" disabled>
                    Continue with Google
                  </button>
                  <button className="btn btn-outline-light w-100" disabled>
                    Continue with Facebook
                  </button>
                </div>

                <p className="text-center small text-light mt-3 mb-0">
                  Social login buttons are UI placeholders for now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;