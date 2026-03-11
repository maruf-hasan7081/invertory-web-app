import { useNavigate } from "react-router-dom";

function AdminPanel(){

  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const handleLogout = ()=>{
    localStorage.removeItem("isAdmin");
    navigate("/login");
  }

  return(

    <div className="bg-dark text-white min-vh-100 p-5">

        <div className="d-flex justify-content-between mb-4">

            <h2>Admin Panel</h2>

            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>

        </div>

        <h4>Registered Users</h4>

        <table className="table table-dark">

            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>

            <tbody>

            {
                users.map((user,index)=>(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                    </tr>
                ))
            }

            </tbody>

        </table>

    </div>

  )
}

export default AdminPanel