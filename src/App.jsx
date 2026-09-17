import { useState } from "react";
import "./App.css";

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
function getTimeAgo(date) {
  if (!date) return "Just now";
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        setUsers((previousUsers) => [...previousUsers, data]);
        setMessage("Registration successful!");
        setForm({
          name: "",
          email: "",
          password: ""
        });
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };
  return (
    <div className="page">
      {/* HEADER */}
      <div className="title-section">
        <h1>🔒Registration Vault</h1><br></br>
           <p>Post / auth / register . MongoDB At Las</p>
      </div>
      <div className="content">
        {/* LEFT - NEW ENTRY */}
        <div className="card form-card">
          <h2>New Entry</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name" required/>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email" required/>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password" required/>
            <button type="submit">🔒Hash & Register</button>
          </form>
          {message && (
            <p className="message">{message}</p>)}
        </div>
        {/* RIGHT - VAULT LOG */}
        <div className="card vault-card">
          <div className="vault-heading">
            <h2>Vault Log</h2>
            <span className="count">{users.length} registered</span>
          </div>
          <div className="user-list">
            {users.length === 0 ? (
              <div className="empty">No registered users yet</div>
            ) : (
              users.map((user) => (
                <div className="user-item" key={user.id}>
                  <div className="user-left">
                    {/* INITIALS */}
                    <div className="avatar">{getInitials(user.name)}</div>
                    {/* USER DETAILS */}
                    <div className="user-details">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                      {/* MASKED HASH PREVIEW */}
                      <span className="hash-preview">$2b$10$X9Kf...eL2m</span>
                    </div>
                  </div>
                  {/* VERIFIED */}
                  <div className="verified-box">
                    <strong> VERIFIED </strong>
                    <small>{getTimeAgo(user.createdAt)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;