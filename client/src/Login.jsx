import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = () => {

    // admin login
    if(email === "admin" && password === "admin123"){
        localStorage.setItem("isAdmin","true");
        navigate("/admin");
        return;
    }

    // normal user login
    const savedUser = JSON.parse(localStorage.getItem("users"));

    if(savedUser){
        const user = savedUser.find(u => u.email === email && u.password === password);

        if(user){
            localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("userEmail",email);
            navigate("/home");
        }
        else{
            alert("Invalid email or password");
        }
    }
    else{
        alert("No users registered");
    }
  }

  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">

        <div className="card bg-secondary p-4" style={{width:"400px"}}>

            <h2 className="text-center mb-3">Login</h2>

            <input
              className="form-control mb-3"
              placeholder="Email or admin"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-100 mb-2" onClick={handleLogin}>
              Login
            </button>

            <p className="text-center">
              Don't have account ?
              <Link to="/register"> Register</Link>
            </p>

            <hr/>

            <p className="text-warning small text-center">
              Admin Login: <br/>
              username: admin <br/>
              password: admin123
            </p>

        </div>

    </div>
  );
}

export default Login;