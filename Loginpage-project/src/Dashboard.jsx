import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "./assets/plogo.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role;

  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    managerId: "",
  });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("users")) || [];

    if (existing.find((u) => u.email === formData.email)) {
      alert("Email already exists");
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now(),
    };

    const updated = [...existing, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);

    alert("User Created Successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "employee",
      managerId: "",
    });
  };

  const managers = users.filter((u) => u.role === "manager");
  const employees = users.filter((u) => u.role === "employee");

  // Employees under logged-in manager
  const managerEmployees = employees.filter(
    (emp) => emp.managerId === currentUser?.id
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const getManagerName = (managerId) => {
    const manager = users.find((u) => u.id === managerId);
    return manager ? manager.name : "Not Assigned";
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="logo" />
          <h2>{role}</h2>
        </div>

        <ul>
          <li
            className={active === "Dashboard" ? "active" : ""}
            onClick={() => setActive("Dashboard")}
          >
            Dashboard
          </li>

          {(role === "admin" || role === "manager") && (
            <li
              className={active === "Users" ? "active" : ""}
              onClick={() => setActive("Users")}
            >
              Users
            </li>
          )}

          {role === "admin" && (
            <li
              className={active === "Create" ? "active" : ""}
              onClick={() => setActive("Create")}
            >
              Create User
            </li>
          )}
        </ul>
      </div>

      {/* MAIN */}
      <div className="content-area">
        {/* NAVBAR */}
        <div className="navbar">
          {(role === "admin" || role === "manager") && (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          <div className="nav-right">
            <div
              className="user-icon"
              onClick={() => setDropdown(!dropdown)}
            >
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>

            {dropdown && (
              <div className="dropdown">
                <p>{currentUser?.name}</p>
                <p>{currentUser?.role}</p>
                <hr />
                <p onClick={handleLogout} className="logout-btn">
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="main-content">
          {/* DASHBOARD */}
          {active === "Dashboard" && (
            <div className="cards">
              {role === "admin" && (
                <>
                  <div className="card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                  </div>
                  <div className="card">
                    <h3>Total Managers</h3>
                    <p>{managers.length}</p>
                  </div>
                  <div className="card">
                    <h3>Total Employees</h3>
                    <p>{employees.length}</p>
                  </div>
                </>
              )}

              {role === "manager" && (
                <div className="card">
                  <h3>Your Team Members</h3>
                  <p>{managerEmployees.length}</p>
                </div>
              )}

              {role === "employee" && (
                <div className="profile-card">
                  <h2>Welcome {currentUser?.name}</h2>
                  <p>Email: {currentUser?.email}</p>
                  <p>Your Manager: {getManagerName(currentUser?.managerId)}</p>
                </div>
              )}
            </div>
          )}

          {/* USERS VIEW */}
          {active === "Users" && role === "admin" && (
            <div className="table-container">
              <h2>All Users</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.role === "employee"
                          ? getManagerName(user.managerId)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MANAGER VIEW */}
          {active === "Users" && role === "manager" && (
            <div className="table-container">
              <h2>Your Employees</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {managerEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CREATE USER */}
          {active === "Create" && role === "admin" && (
            <div className="form-card">
              <h2>Create User</h2>
              <form onSubmit={handleCreateUser}>
                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>

                {formData.role === "employee" && (
                  <select
                    value={formData.managerId}
                    onChange={(e) =>
                      setFormData({ ...formData, managerId: Number(e.target.value) })
                    }
                    required
                  >
                    <option value="">Assign Manager</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                )}

                <button type="submit">Create User</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;