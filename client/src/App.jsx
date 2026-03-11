import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Failed to connect backend"));
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary px-4">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-2" href="#">
            Inventory App
          </a>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search inventories..."
            />
            <button className="btn btn-primary">Login</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-5 px-5">

        <h1 className="display-3 fw-bold">Welcome to Inventory App</h1>
        <p className="fs-3 text-light">
          Manage inventories and items easily.
        </p>

        {/* Backend Status */}
        <div className="card bg-secondary text-white mt-4 shadow">
          <div className="card-body p-4">
            <h3 className="card-title fw-bold">Backend Status</h3>
            <p className="card-text fs-5">{message}</p>
          </div>
        </div>

        {/* Latest Inventories Table */}
        <div className="mt-5">
          <h2 className="mb-3">Latest Inventories</h2>

          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Creator</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Office Laptops</td>
                <td>Company laptop inventory</td>
                <td>Admin</td>
              </tr>

              <tr>
                <td>2</td>
                <td>Library Books</td>
                <td>University book collection</td>
                <td>Maruf</td>
              </tr>

              <tr>
                <td>3</td>
                <td>Lab Equipment</td>
                <td>Computer lab devices</td>
                <td>Teacher</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}

export default App;