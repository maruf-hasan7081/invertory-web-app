import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Failed to register");
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card bg-secondary text-white p-4 shadow"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <h2 className="mb-4 text-center">Register</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100 mb-3" onClick={handleRegister}>
          Register
        </button>

        <p className="text-center mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-info text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;