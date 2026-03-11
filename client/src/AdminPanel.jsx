import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const adminEmail = localStorage.getItem("userEmail");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        headers: {
          "x-user-email": adminEmail || "",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to fetch users");
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      alert("Failed to fetch users");
    }
  }, [adminEmail]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBlock = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "x-user-email": adminEmail || "",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to block user");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Block user error:", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/users/${id}/unblock`,
        {
          method: "PATCH",
          headers: {
            "x-user-email": adminEmail || "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to unblock user");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Unblock user error:", error);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/users/${id}/make-admin`,
        {
          method: "PATCH",
          headers: {
            "x-user-email": adminEmail || "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to make admin");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Make admin error:", error);
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/users/${id}/remove-admin`,
        {
          method: "PATCH",
          headers: {
            "x-user-email": adminEmail || "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to remove admin");
        return;
      }

      if (Number(localStorage.getItem("userId")) === id) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Remove admin error:", error);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-email": adminEmail || "",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-dark text-white min-vh-100 p-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Panel</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card bg-secondary text-white p-4">
        <h4 className="mb-3">User Management</h4>

        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBlocked ? "Yes" : "No"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    {user.isBlocked ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleUnblock(user.id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleBlock(user.id)}
                      >
                        Block
                      </button>
                    )}

                    {user.role === "user" ? (
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => handleMakeAdmin(user.id)}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRemoveAdmin(user.id)}
                      >
                        Remove Admin
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;