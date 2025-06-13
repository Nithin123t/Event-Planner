import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = register(form.email, form.password, form.role);
    if (res.success) {
      toast.success("🎉 Registration successful!");
      navigate("/");
    } else {
      setError(res.message);
      toast.error("❌ " + res.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <div className="role-selection">
            <div
              className={`role-option ${form.role === "user" ? "selected" : ""}`}
              onClick={() => setForm({ ...form, role: "user" })}
            >
              User
            </div>
            <div
              className={`role-option ${form.role === "admin" ? "selected" : ""}`}
              onClick={() => setForm({ ...form, role: "admin" })}
            >
              Admin
            </div>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Register
        </button>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
}
