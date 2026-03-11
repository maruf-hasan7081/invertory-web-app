import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login");
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login will be integrated later");
  };

  const handleFacebookLogin = () => {
    alert("Facebook login will be integrated later");
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          {/* Left side */}
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-3">
              Inventory Management System
            </h1>
            <p className="fs-5 text-light mb-4">
              Login to manage inventories, items, user access, and admin
              features in one place.
            </p>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Social Login</h5>
                    <p className="card-text small mb-0">
                      Requirement-friendly Google and Facebook login section.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">User Management</h5>
                    <p className="card-text small mb-0">
                      Registered users can login and access their inventories.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Admin Panel</h5>
                    <p className="card-text small mb-0">
                      Admin can manage users, roles, block/unblock, and more.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card bg-secondary text-white h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">Inventory Access</h5>
                    <p className="card-text small mb-0">
                      Login gives access to create, edit, and manage inventory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="col-lg-6">
            <div className="card bg-secondary text-white shadow border-0">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center fw-bold mb-4">Login</h2>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleLogin}
                >
                  Login
                </button>

                <div className="text-center mb-3">
                  <Link
                    to="/forgot-password"
                    className="text-warning text-decoration-none"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="text-center mb-3">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-info text-decoration-none"
                  >
                    Register
                  </Link>
                </div>

                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-light">or continue with</span>
                  <hr className="flex-grow-1" />
                </div>

                <button
                  className="btn btn-outline-light w-100 mb-2"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </button>

                <button
                  className="btn btn-outline-light w-100 mb-3"
                  onClick={handleFacebookLogin}
                >
                  Continue with Facebook
                </button>

                <div className="card bg-dark border border-light-subtle mt-3">
                  <div className="card-body text-center">
                    <h6 className="text-warning mb-2">Admin Demo Login</h6>
                    <p className="text-warning mb-2">Email: admin@gmail.com</p>
                    <p className="text-warning mb-2">Password: admin123</p>
                  </div>
                </div>

                <p className="small text-center text-light mt-3 mb-0">
                  Social login buttons are currently demo placeholders for UI.
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