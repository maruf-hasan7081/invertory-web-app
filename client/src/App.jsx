import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import InventoryDetails from "./InventoryDetails";

function HomePage() {
  const [message, setMessage] = useState("Loading...");
  const [inventories, setInventories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Backend not deployed yet"));
  }, []);

  const fetchInventories = async () => {
    try {
      const res = await fetch("http://localhost:5000/inventories");
      const data = await res.json();
      setInventories(data);
    } catch (error) {
      console.error("Fetch inventories error:", error);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const handleAddInventory = async () => {
    if (!title || !description || !creator) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/inventories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          creator,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create inventory");
      }

      await fetchInventories();
      resetForm();
    } catch (error) {
      console.error("Add inventory error:", error);
      alert("Failed to save inventory");
    }
  };

  const handleEdit = (inventory) => {
    setEditId(inventory.id);
    setTitle(inventory.title);
    setDescription(inventory.description);
    setCreator(inventory.creator);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    if (!title || !description || !creator) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/inventories/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          creator,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update inventory");
      }

      await fetchInventories();
      resetForm();
    } catch (error) {
      console.error("Update inventory error:", error);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this inventory?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/inventories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete inventory");
        return;
      }

      await fetchInventories();
    } catch (error) {
      console.error("Delete inventory error:", error);
      alert("Failed to delete inventory");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCreator("");
    setShowForm(false);
  };

  const filteredInventories = inventories.filter((inventory) =>
    inventory.title.toLowerCase().includes(searchText.toLowerCase()) ||
    inventory.description.toLowerCase().includes(searchText.toLowerCase()) ||
    inventory.creator.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bg-dark text-white min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary px-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-2 text-decoration-none" to="/">
            Inventory App
          </Link>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search inventories..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btn btn-primary">Login</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-5 px-4">
        <h1 className="display-3 fw-bold">Welcome to Inventory App</h1>
        <p className="fs-3 text-light">Manage inventories and items easily.</p>

        <div className="card bg-secondary text-white mt-4 shadow">
          <div className="card-body p-4">
            <h3 className="card-title fw-bold">Backend Status</h3>
            <p className="card-text fs-5">{message}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Latest Inventories</h2>
            <span className="badge bg-info text-dark fs-6">
              Total: {filteredInventories.length}
            </span>
          </div>

          <div className="mb-3 d-flex gap-2">
            <button
              className="btn btn-success"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  resetForm();
                }
              }}
            >
              {showForm ? "Close Form" : "Add Inventory"}
            </button>
          </div>

          {showForm && (
            <div className="card bg-secondary text-white p-4 mb-4">
              <h4 className="mb-3">
                {editId ? "Edit Inventory" : "Add New Inventory"}
              </h4>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Creator"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
              />

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={editId ? handleUpdate : handleAddInventory}
                >
                  {editId ? "Update Inventory" : "Save Inventory"}
                </button>

                <button className="btn btn-outline-light" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {filteredInventories.length === 0 ? (
            <div className="alert alert-warning">No inventories found.</div>
          ) : (
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Creator</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInventories.map((inventory, index) => (
                  <tr key={inventory.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        to={`/inventory/${inventory.id}`}
                        className="text-info text-decoration-none"
                      >
                        {inventory.title}
                      </Link>
                    </td>
                    <td>{inventory.description}</td>
                    <td>{inventory.creator}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(inventory)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(inventory.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inventory/:id" element={<InventoryDetails />} />
    </Routes>
  );
}

export default App;