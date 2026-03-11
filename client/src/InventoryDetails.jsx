import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function InventoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/inventories/${id}`)
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((error) => console.log(error));
  }, [id]);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/inventories/${id}/items`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async () => {
    if (!name || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/inventories/${id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item");
      }

      setName("");
      setDescription("");
      fetchItems();
    } catch (error) {
      console.log(error);
      alert("Failed to add item");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!inventory) {
    return (
      <div className="bg-dark text-white min-vh-100 p-5">
        <h2>Loading inventory details...</h2>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100 p-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/home" className="btn btn-secondary">
          Back
        </Link>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card bg-secondary text-white p-4 mb-4">
        <h1 className="mb-3">{inventory.title}</h1>
        <p>
          <strong>Description:</strong> {inventory.description}
        </p>
        <p>
          <strong>Creator:</strong> {inventory.creator}
        </p>
        <p>
          <strong>ID:</strong> {inventory.id}
        </p>
      </div>

      <div className="card bg-secondary text-white p-4 mb-4">
        <h3 className="mb-3">Add Item</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleAddItem}>
          Add Item
        </button>
      </div>

      <div className="card bg-secondary text-white p-4">
        <h3 className="mb-3">Items</h3>

        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InventoryDetails;