import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import logo from "./assets/plogo.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role;

  const [active, setActive] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    managerId: "",
  });
const [visible, setVisible] = useState(false);

const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  phone: "",
  role: "employee",
  managerId: null
});
  const [taskText, setTaskText] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setTasks(JSON.parse(localStorage.getItem("tasks")) || []);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // =========================
  // CREATE USER
  // =========================
  const handleCreateUser = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("users")) || [];

    if (existing.find((u) => u.email === formData.email)) {
      toast.error("Email already exists");
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now(),
      managerId:
        formData.role === "employee"
          ? Number(formData.managerId)
          : null,
    };

    const updated = [...existing, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);

    toast.success("User Created Successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "employee",
      managerId: "",
    });
  };

  // =========================
  // ASSIGN / UPDATE TASK
  // =========================
  const handleAssignTask = () => {
    if (!selectedEmployee) {
      toast.error("Please select employee");
      return;
    }

    if (!taskText.trim()) {
      toast.error("Please enter task");
      return;
    }

    let updatedTasks = [...tasks];

    const employeeIdNum = Number(selectedEmployee);

    const index = updatedTasks.findIndex(
      (t) => t.employeeId === employeeIdNum
    );

    if (index !== -1) {
      updatedTasks[index].task = taskText;
    } else {
      updatedTasks.push({
        id: Date.now(),
        employeeId: employeeIdNum,
        managerId: currentUser.id,
        task: taskText,
      });
    }

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    toast.success("Task Saved Successfully");
    setTaskText("");
    setSelectedEmployee(null);
  };

  const managers = users.filter((u) => u.role === "manager");
  const employees = users.filter((u) => u.role === "employee");

  const managerEmployees = employees.filter(
    (emp) => emp.managerId === currentUser?.id
  );

  const getEmployeeTask = (employeeId) => {
    const taskObj = tasks.find((t) => t.employeeId === employeeId);
    return taskObj ? taskObj.task : "No Task Assigned";
  };

  const getManagerName = (managerId) => {
    const manager = users.find((u) => u.id === managerId);
    return manager ? manager.name : "Not Assigned";
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" />

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

          {/* ================= ADMIN DASHBOARD ================= */}
          {active === "Dashboard" && role === "admin" && (
            <div className="cards">
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
            </div>
          )}

          {/* ================= MANAGER DASHBOARD ================= */}
          {active === "Dashboard" && role === "manager" && (
            <div className="cards">
              <div className="card">
                <h3>Your Team Members</h3>
                <p>{managerEmployees.length}</p>
              </div>
            </div>
          )}

          {/* ================= EMPLOYEE DASHBOARD ================= */}
          {active === "Dashboard" && role === "employee" && (
            <div className="profile-card">
              <h2>Welcome {currentUser?.name}</h2>
              <p>Email: {currentUser?.email}</p>
              <p>Manager: {getManagerName(currentUser?.managerId)}</p>
              <p>
                <strong>Your Task:</strong>{" "}
                {getEmployeeTask(currentUser?.id)}
              </p>
            </div>
          )}

          {/* ================= MANAGER USERS VIEW ================= */}
          {active === "Users" && role === "manager" && (
            <div className="task-section">
              <h2>Your Employees</h2>

              <div className="task-card">
                <select
                  className="task-select"
                  value={selectedEmployee || ""}
                  onChange={(e) =>
                    setSelectedEmployee(e.target.value)
                  }
                >
                  <option value="">Select Employee</option>
                  {managerEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="task-input"
                  placeholder="Enter Task"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                />

                <button
                  className="task-btn"
                  onClick={handleAssignTask}
                >
                  Save Task
                </button>
              </div>

              <div className="task-table">
                {managerEmployees.map((emp) => (
                  <div key={emp.id} className="task-row">
                    <span>{emp.name}</span>
                    <span>{getEmployeeTask(emp.id)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

         {/* ================= ADMIN USERS VIEW ================= */}
{active === "Users" && role === "admin" && (
  <div className="table-container">
    <div className="table-header">
  <h2>All Users</h2>
  <Button 
    label="Add User" 
    icon="pi pi-plus"
  className="ad"
    onClick={() => setVisible(true)} 
  />
</div>
<Dialog
  header="Add New User"
  visible={visible}
  className="custom-dialog"
  style={{ width: "500px" }}
  onHide={() => setVisible(false)}
>
  <div className="p-fluid">

    {/* Row 1: Name + Email */}
    <div className="row">
      <div className="field half">
        <label>Name</label>
        <InputText
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
      </div>

      <div className="field half">
        <label>Email</label>
        <InputText
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
    </div>

    {/* Row 2: Phone + Age */}
    <div className="row">
      <div className="field half">
        <label>Phone</label>
        <InputText
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
      </div>

      <div className="field half">
        <label>Age</label>
        <InputText
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
        />
      </div>
    </div>

    {/* Row 3: Gender + Birthdate */}
    <div className="row">
      <div className="field half">
        <label>Gender</label>
        <Dropdown
          value={newUser.gender}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" }
          ]}
          onChange={(e) => setNewUser({ ...newUser, gender: e.value })}
          className="custom-dropdown"
        />
      </div>

      <div className="field half">
        <label>Birthdate</label>
        <InputText
          type="date"
          value={newUser.birthdate}
          onChange={(e) => setNewUser({ ...newUser, birthdate: e.target.value })}
        />
      </div>
    </div>

    {/* Row 4: City + Pincode */}
    <div className="row">
      <div className="field half">
        <label>City</label>
        <InputText
          value={newUser.city}
          onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
        />
      </div>

      <div className="field half">
        <label>Pincode</label>
        <InputText
          value={newUser.pincode}
          onChange={(e) => setNewUser({ ...newUser, pincode: e.target.value })}
        />
      </div>
    </div>

    {/* Row 5: Address (full width) */}
    <div className="row">
      <div className="field full">
        <label>Address</label>
        <InputText
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
      </div>
    </div>

    {/* Row 6: Role + Manager */}
    <div className="row">
      <div className="field half">
        <label>Role</label>
        <Dropdown
          value={newUser.role}
          options={[
            { label: "Employee", value: "employee" },
            { label: "Manager", value: "manager" }
          ]}
          onChange={(e) => setNewUser({ ...newUser, role: e.value })}
          className="custom-dropdown"
        />
      </div>

      {newUser.role === "employee" && (
        <div className="field half">
          <label>Assign Manager</label>
          <Dropdown
            value={newUser.managerId}
            options={users
              .filter(u => u.role === "manager")
              .map(m => ({ label: m.name, value: m.id }))}
            onChange={(e) => setNewUser({ ...newUser, managerId: e.value })}
            className="custom-dropdown"
          />
        </div>
      )}
    </div>

    {/* Submit Button */}
    <Button
      label="Submit"
      className="sub"
      onClick={() => {
        if (!newUser.name || !newUser.email) {
          toast.error("Name and Email required");
          return;
        }

        const updatedUsers = [...users, { ...newUser, id: Date.now() }];
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        setVisible(false);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          birthdate: "",
          city: "",
          pincode: "",
          address: "",
          role: "employee",
          managerId: null
        });

        toast.success("User Added Successfully");
      }}
    />
  </div>
</Dialog>
   
    <DataTable
  value={users}
  paginator
  rows={5}
  stripedRows
  showGridlines
  globalFilter={search}
  emptyMessage="No users found"
>
    
      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="role" header="Role" sortable />

      <Column
        header="Manager"
        body={(rowData) =>
          rowData.role === "employee"
            ? getManagerName(rowData.managerId)
            : "-"
        }
      />
    </DataTable>
  </div>
)}

          {/* ================= CREATE USER ================= */}
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
                      setFormData({
                        ...formData,
                        managerId: e.target.value,
                      })
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