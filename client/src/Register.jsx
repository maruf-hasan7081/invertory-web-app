import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = () => {

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem("users",JSON.stringify(users));

    alert("Registration successful");

    navigate("/login");
  }

  return(

    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">

        <div className="card bg-secondary p-4" style={{width:"400px"}}>

            <h2 className="text-center mb-3">Register</h2>

            <input
            className="form-control mb-3"
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
            />

            <input
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            />

            <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            />

            <button className="btn btn-success w-100" onClick={handleRegister}>
              Register
            </button>

        </div>

    </div>
  )
}

export default Register