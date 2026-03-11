import { Routes,Route,Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import HomePage from "./HomePage";
import InventoryDetails from "./InventoryDetails";
import AdminPanel from "./AdminPanel";

function App(){

  return(

    <Routes>

        <Route path="/" element={<Navigate to="/login"/>} />

        <Route path="/login" element={<Login/>} />

        <Route path="/register" element={<Register/>} />

        <Route path="/home" element={<HomePage/>} />

        <Route path="/inventory/:id" element={<InventoryDetails/>} />

        <Route path="/admin" element={<AdminPanel/>} />

    </Routes>

  )
}

export default App